import cgi
import os
import sys
import json

from mysql import mysql


def ls(form, params, cursor):
    """
    params:
        path: directory of file, start with /
    return:
        list: list of {filename, is_dir, size}
    """
    fpath = params['path']

    sql = 'SELECT * FROM file_list WHERE path="%s"' % (fpath)
    result = mysql(sql, cursor)
    ret = [{'filename': ln['filename'], 'is_dir': ln['is_dir'],
            'size': ln['size']} for ln in result]

    fin_ret = []
    if fpath == '/':
        sql = 'SELECT * FROM belongs where user_name="%s"' % (params['user'])
        result = mysql(sql, cursor)
        grps = [ln['group_name'] for ln in result]
        grps = [params['user']] + grps
        for item in ret:
            if item['filename'] in grps:
                fin_ret.append(item)
    else:
        fin_ret = ret

    return {'errno': 0, 'list': json.dumps(fin_ret)}
