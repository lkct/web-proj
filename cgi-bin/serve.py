#!/usr/bin/python
# -*- coding: UTF-8 -*-

import cgi
import cgitb
import os
import sys
import traceback
import json
import urlparse
import datetime
import MySQLdb

import func


def check_path(path, user, fname=None):
    if path == '/':
        return {'errno': 0, 'path': '/'}
    if path[-1] == '/':
        path = path[:-1]
    if path[0] != '/':
        path = '/' + path

    if fname in not None:
        sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (path, fname)
        result = func.mysql(sql, cursor)
        if len(result) == 0:
            return {'errno': 5, 'errmsg': 'File not exist'}
    else:
        dirn = os.path.dirname(path)
        basen = os.path.basename(path)
        sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (dirn, basen)
        result = func.mysql(sql, cursor)
        if len(result) == 0 or result[0]['is_dir'] == 0:
            return {'errno': 5, 'errmsg': 'Directory not exist'}

    grp = path.split('/')[1]
    sql = 'SELECT * FROM belongs where user_name="%s"' % (user)
    result = func.mysql(sql, cursor)
    grps = [ln['group_name'] for ln in result]
    grps = [user] + grps
    if grp not in grps:
        return {'errno': 3, 'errmsg': 'Access not authorized'}

    return {'errno': 0, 'path': path}


def check_grp(group, user, check_own=0):
    sql = 'SELECT * FROM belongs WHERE group_name="%s"' % (group)
    result = func.mysql(sql, cursor)
    if len(result) == 0:
        return {'errno': 6, 'errmsg': 'Group not exist'}

    sql = 'SELECT * FROM belongs WHERE group_name="%s" AND user_name="%s"' % (group, user)
    result = func.mysql(sql, cursor)
    if len(result) == 0:
        return {'errno': 3, 'errmsg': 'Access not authorized'}

    if check_own == 1 and result[0]['is_own'] == 0:
        return {'errno': 3, 'errmsg': 'Access not authorized'}
    
    return {'errno': 0}


def serve(form, cursor):
    auth = dict(urlparse.parse_qsl(form['auth'].file.read()))
    params = dict(urlparse.parse_qsl(form['params'].file.read()))
    fun = params['func']
    allow_func = ['diff', 'upload', 'commit', 'mkdir', 'rm', 'ls', 'ln', 'cp', 'download',
                  'reg', 'login', 'refresh', 'newgrp', 'delgrp', 'lsgrps', 'newmbr', 'delmbr', 'lsmbr']
    if fun not in allow_func:
        return {'errno': 1, 'errmsg': 'Requested func not implemented'}

    if fun not in ['reg', 'login']:
        ret = func.token.check(auth['token'])
        if ret['errno'] > 0:
            return ret
        params['user'] = ret['user']

        if params.has_key('path'):
            if func in ['cp', 'download']:
                ret = check_path(params['path'], params['user'], params['filename'])
            else:
                ret = check_path(params['path'], params['user'])
            if ret['errno'] > 0:
                return ret
            params['path'] = ret['path']
        if params.has_key('path2'):
            ret = check_path(params['path2'], params['user'])
            if ret['errno'] > 0:
                return ret
            params['path2'] = ret['path']

        if fun in ['lsmbr']:
            ret = check_grp(params['group'], params['user'])
            if ret['errno'] > 0:
                return ret
        if fun in ['delgrp', 'newmbr', 'delmbr']:
            ret = check_grp(params['group'], params['user'], 1)
            if ret['errno'] > 0:
                return ret

    return eval('func.'+fun)(form, params, cursor)


log_file = '/var/www/html/grp-srv/tmp/err.log'

# cgitb.enable()

try:
    form = cgi.FieldStorage()
    
    db = MySQLdb.connect('localhost', 'web', 'web', 'web', charset='utf8')
    cursor = db.cursor()

    msg = serve(form, cursor)
    err2stat = {0: 200, 1: 400, 2: 403, 3: 403, 4: 403, 5: 404, 6: 404, 7:400, 8: 400}
    stat = err2stat[msg['errno']]

    db.commit()
    db.close()
except Exception, e:
    try:
        with open(log_file, 'w', 664) as f:
            f.write(str(datetime.datetime.now()))
            f.write('\n')
            f.write(traceback.format_exc())
            f.write('\n')
            f.write(str(form))

        db.rollback()
        db.close()
    except Exception, ee:
        pass

    stat = '400 Bad Request'
    msg = {'errno': -1, 'errmsg': 'Error occured, check server log for details'}

print '''\
Status: %d
Content-Type: text/html

%s
''' % (stat, json.dumps(msg))
