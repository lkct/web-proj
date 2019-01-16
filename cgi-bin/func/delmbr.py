import cgi
import os
import sys

from mysql import mysql


def delmbr(form, params, cursor):
    """
    params:
        group: group name
        user2: user to del
    return:
        NONE
    """
    group = params['group']
    user2 = params['user2']
    user = params['user']

    if user == user2:
        return {'errno': 3, 'errmsg': 'Can\'t delete self'}

    sql = 'DELETE FROM belongs WHERE group_name="%s" AND user_name="%s"' % (
        group, user2)
    mysql(sql, cursor)

    return {'errno': 0}
