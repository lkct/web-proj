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

import func


def check_path(path, user):
    if path == '/':
        return {'errno': 0, 'path': '/'}
    if path[-1] == '/':
        path = path[:-1]
    if path[0] != '/':
        path = '/' + path
    dirn = os.path.dirname(path)
    basen = os.path.basename(path)
    sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (dirn, basen)
    result = func.mysql(sql)
    if result[0]['is_dir'] == 0:
        return {'errno': 1, 'errmsg': 'Not a directory'}
    grp = path.split('/')[1]
    sql = 'SELECT * FROM belongs where user_name="%s"' % (user)
    result = func.mysql(sql)
    grps = [ln['group_name'] for ln in result]
    grps = [user] + grps
    if grp not in grps:
        return {'errno': 1, 'errmsg': 'Access not authorized'}
    return {'errno': 0, 'path': path}


def check_grp(group, user=None):
    sql = 'SELECT * FROM belongs WHERE group_name="%s"' % (group)
    result = func.mysql(sql)
    if len(result) == 0:
        return {'errno': 1, 'errmsg': 'Group not exist'}
    
    if user is not None:
        sql = 'SELECT * FROM belongs WHERE group_name="%s" AND user_name="%s"' % (group, user)
        result = func.mysql(sql)
        if result[0]['is_own'] == 0:
            return {'errno': 1, 'errmsg': 'Access not authorized'}
    
    return {'errno': 0}


def serve(form):
    auth = dict(urlparse.parse_qsl(form['auth'].file.read()))
    params = dict(urlparse.parse_qsl(form['params'].file.read()))
    assert not params.has_key('user')
    fun = params['func']
    allow_func = ['diff', 'save_file', 'commit', 'mkdir', 'rm', 'ls', 'ln', 'cp', 'download',
                  'reg', 'login', 'refresh', 'newgrp', 'delgrp', 'lsgrps', 'newmbr', 'delmbr', 'lsmbr']
    assert fun in allow_func

    # TODO: check auth[%s] user/pass if login, prevent root

    if fun not in ['reg', 'login']:
        ret = func.token.check(auth['token'])
        if ret['errno'] > 0:
            stat = '200 OK'
            msg = ret
            return (stat, msg)
        params['user'] = ret['user']

        if params.has_key('path'):
            ret = check_path(params['path'], params['user'])
            if ret['errno'] > 0:
                stat = '200 OK'
                msg = ret
                return (stat, msg)
            params['path'] = ret['path']
        if params.has_key('path2'):
            ret = check_path(params['path2'], params['user'])
            if ret['errno'] > 0:
                stat = '200 OK'
                msg = ret
                return (stat, msg)
            params['path2'] = ret['path']

        if fun in ['lsmbr']:
            ret = check_grp(params['group'])
            if ret['errno'] > 0:
                stat = '200 OK'
                msg = ret
                return (stat, msg)
        if fun in ['delgrp', 'newmbr', 'delmbr']:
            ret = check_grp(params['group'], params['user'])
            if ret['errno'] > 0:
                stat = '200 OK'
                msg = ret
                return (stat, msg)

    return eval('func.'+fun)(form, params)


log_file = '/var/www/html/grp-srv/tmp/err.log'

# cgitb.enable()
form = cgi.FieldStorage()

try:
    stat, msg = serve(form)
except Exception, e:
    stat = '400 Bad Request'
    msg = {'errno': -1, 'errmsg': 'Error occured, check server log for details'}

    with open(log_file, 'w', 664) as f:
        f.write(str(datetime.datetime.now()))
        f.write('\n')
        f.write(traceback.format_exc())
        f.write('\n')
        f.write(str(form))

print '''\
Status: %s
Content-Type: text/html

%s
''' % (stat, json.dumps(msg))
