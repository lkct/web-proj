import cgi
import os
import sys

from mysql import mysql

def newmbr(form, params):
    """
    params:
        group: group name
        user2: user to add
    return:
        NONE
    """
    group = params['group']
    user2 = params['user2']

    stat = '200 OK'

    sql = 'SELECT * FROM users WHERE user_name="%s"' % (user2)
    result = mysql(sql)
    if len(result) == 0:
        msg = {'errno': 1, 'errmsg': 'User not exist'}
        return (stat, msg)

    sql = 'SELECT * FROM belongs WHERE group_name="%s" AND user_name="%s"' % (group, user2)
    result = mysql(sql)
    if len(result) > 0:
        msg = {'errno': 1, 'errmsg': 'User already in group'}
        return (stat, msg)

    sql = 'INSERT INTO belongs (group_name, user_name) ' \
        'VALUES ("%s", "%s")' % (user, group)
    mysql(sql)

    msg = {'errno': 0}
    return (stat, msg)
