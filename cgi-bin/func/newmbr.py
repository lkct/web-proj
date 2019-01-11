import cgi
import os
import sys

from mysql import mysql

def newmbr(form, params, cursor):
    """
    params:
        group: group name
        user2: user to add
    return:
        NONE
    """
    group = params['group']
    user2 = params['user2']

    sql = 'SELECT * FROM users WHERE user_name="%s"' % (user2)
    result = mysql(sql, cursor)
    if len(result) == 0:
        msg = {'errno': 1, 'errmsg': 'User not exist'}
        return msg

    sql = 'SELECT * FROM belongs WHERE group_name="%s" AND user_name="%s"' % (group, user2)
    result = mysql(sql, cursor)
    if len(result) > 0:
        msg = {'errno': 1, 'errmsg': 'User already in group'}
        return msg

    sql = 'INSERT INTO belongs (group_name, user_name) ' \
        'VALUES ("%s", "%s")' % (group, user2)
    mysql(sql, cursor)

    msg = {'errno': 0}
    return msg
