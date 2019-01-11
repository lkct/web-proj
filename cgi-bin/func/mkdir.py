import cgi
import os
import sys

from mysql import mysql

def mkdir(form, params, cursor):
    """
    params:
        filename: name of file
        path: directory of file, start with /
    return:
        errno
    """
    fn = params['filename']
    fpath = params['path']

    sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (fpath, fn)
    result = mysql(sql, cursor)
    if len(result) > 0:
        msg = {'errno': 1, 'errmsg': 'File of same name alreasy existed at destination'}
    else:
        sql = 'INSERT INTO file_list (path, filename, is_dir) ' \
            'VALUES ("%s", "%s", %d)' % (fpath, fn, 1)
        mysql(sql, cursor)
        msg = {'errno': 0}

    return msg
