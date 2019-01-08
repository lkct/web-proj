import cgi
import os
import sys
import urlparse

from mysql import mysql
from token import generate
from rsa import decrypt

def login(form, params):
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

    # passwd = decrypt(passwd)
    sql = 'SELECT * FROM users WHERE user_name="%s" AND passwd="%s"' % (user, passwd)
    result = mysql(sql)
    if len(result) == 0:
        msg = {'errno': 1, 'errmsg': 'User name or password wrong'}
    else:
        token = generate({'user': user}, 300)
        msg = {'errno': 0, 'token': token}

    stat = '200 OK'
    return (stat, msg)