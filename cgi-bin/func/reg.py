import cgi
import os
import sys
import string
import urlparse
import hashlib

from mysql import mysql
from rsa import decrypt

def reg(form, params):
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

    assert string.lower(user) != 'root', 'Register of ROOT not allowed'

    stat = '200 OK'

    sql = 'SELECT * FROM users WHERE user_name="%s"' % (user)
    result = mysql(sql)
    if len(result) > 0:
        msg = {'errno': 1, 'errmsg': 'Duplicate name'}
        return (stat, msg)

    sql = 'SELECT * FROM belongs WHERE group_name="%s"' % (user)
    result = mysql(sql)
    if len(result) > 0:
        msg = {'errno': 1, 'errmsg': 'Duplicate name'}
        return (stat, msg)
    
    passwd = decrypt(passwd)
    md5 = hashlib.md5()
    md5.update(passwd)
    passwd = md5.hexdigest()
    sql = 'INSERT INTO users (user_name, passwd) VALUES ("%s", "%s")' % (user, passwd)
    mysql(sql)
    sql = 'INSERT INTO file_list (path, filename, is_dir) ' \
        'VALUES ("%s", "%s", %d)' % ('/', group, 1)
    mysql(sql)

    msg = {'errno': 0}
    return (stat, msg)