import cgi
import os
import sys
import string
import urlparse
import hashlib

from mysql import mysql
from rsa import decrypt

def reg(form, params, cursor):
    """
    auth:
        user: user name
        passwd: password encrytped and encoded
    return:
        errno
    """
    form['auth'].file.seek(0)
    auth = dict(urlparse.parse_qsl(form['auth'].file.read()))
    user = auth['user']
    passwd = auth['passwd']

    if string.lower(group) == 'root':
        msg = {'errno': 1, 'errmsg': 'Register of ROOT not allowed'}
        return msg

    sql = 'SELECT * FROM users WHERE user_name="%s"' % (user)
    result = mysql(sql, cursor)
    if len(result) > 0:
        msg = {'errno': 1, 'errmsg': 'Duplicate name'}
        return msg

    sql = 'SELECT * FROM belongs WHERE group_name="%s"' % (user)
    result = mysql(sql, cursor)
    if len(result) > 0:
        msg = {'errno': 1, 'errmsg': 'Duplicate name'}
        return msg
    
    passwd = decrypt(passwd)
    md5 = hashlib.md5()
    md5.update(passwd)
    passwd = md5.hexdigest()
    sql = [
        'INSERT INTO users (user_name, passwd) VALUES ("%s", "%s")' % (user, passwd),
        
        'INSERT INTO file_list (path, filename, is_dir) ' \
        'VALUES ("%s", "%s", %d)' % ('/', user, 1)
    ]
    mysql(sql, cursor)

    msg = {'errno': 0}
    return msg
