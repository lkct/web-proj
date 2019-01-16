import cgi
import os
import sys

from mysql import mysql


def diff(form, params, cursor):
    """
    params:
        filename: name of file
        path: directory of file, start with /
        md5: md5 to check existence
    return:
        exist: 1 for md5 exist, 0 for not
        errno
    """
    fn = params['filename']
    fpath = params['path']
    md5 = params['md5']

    if fpath == '/':
        return {'errno': 3, 'errmsg': 'Access not authorized'}

    sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (
        fpath, fn)
    result = mysql(sql, cursor)
    if len(result) > 0:
        return {'errno': 7, 'errmsg': 'File of same name already existed at destination'}
    else:
        sql = 'SELECT * FROM md5_list WHERE md5="%s"' % (md5)
        result = mysql(sql, cursor)
        return {'errno': 0, 'exist': len(result)}
