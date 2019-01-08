import cgi
import os
import sys
import json

from mysql import mysql

def ls(form, params):
    """
    params:
        path: directory of file, start with /
    return:
        list: list of {filename, is_dir, size}
    """
    fpath = params['path']

    sql = 'SELECT * FROM file_list WHERE path="%s"' % (fpath)
    result = mysql(sql)
    ret = []
    for ln in result:
        ret.append({'filename': ln['filename'], 'is_dir': ln['is_dir'], 'size': ln['size']})
    
    fin_ret = []
    if fpath == '/':
        sql = 'SELECT * FROM belongs where user_name="%s"' % (params['user'])
        result = mysql(sql)
        grps = [params['user']]
        for ln in result:
            grps.append(ln['group_name'])
        for item in ret:
            if item['filename'] in grps:
                fin_ret.append(item)
    else:
        fin_ret = ret

    stat = '200 OK'
    msg = {'errno': 0, 'list': json.dumps(fin_ret)}
    return (stat, msg)