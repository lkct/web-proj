import cgi
import os
import sys
import urlparse
import hashlib

from mysql import mysql
from token import generate
from rsa import decrypt

def login(form, params, cursor):
    """
    auth:
        user: user name
        passwd: password encrytped and encoded
    return:
        token: token to work with
        errno
    """
    form['auth'].file.seek(0)
    auth = dict(urlparse.parse_qsl(form['auth'].file.read()))
    user = auth['user']
    passwd = auth['passwd']

    passwd = decrypt(passwd)
    md5 = hashlib.md5()
    md5.update(passwd)
    passwd = md5.hexdigest()
    sql = 'SELECT * FROM users WHERE user_name="%s" AND passwd="%s"' % (user, passwd)
    result = mysql(sql, cursor)
    if len(result) == 0:
        return {'errno': 2, 'errmsg': 'Invalid user name or password'}
    else:
        token = generate({'user': user}, 300)
        return {'errno': 0, 'token': token}
