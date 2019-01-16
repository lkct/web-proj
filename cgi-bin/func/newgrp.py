import cgi
import os
import sys
import string

from mysql import mysql


def newgrp(form, params, cursor):
    """
    params:
        group: group name
    return:
        errno
    """
    user = params['user']
    group = params['group']

    if string.lower(group) == 'root':
        return {'errno': 4, 'errmsg': 'Register name ROOT not allowed'}

    sql = 'SELECT * FROM belongs WHERE group_name="%s"' % (group)
    result = mysql(sql, cursor)
    if len(result) > 0:
        return {'errno': 8, 'errmsg': 'Duplicate name used'}

    sql = 'SELECT * FROM users WHERE user_name="%s"' % (group)
    result = mysql(sql, cursor)
    if len(result) > 0:
        return {'errno': 8, 'errmsg': 'Duplicate name used'}

    sql = [
        'INSERT INTO belongs (group_name, user_name, is_own) '
        'VALUES ("%s", "%s", %d)' % (group, user, 1),

        'INSERT INTO file_list (path, filename, is_dir) '
        'VALUES ("%s", "%s", %d)' % ('/', group, 1)
    ]
    mysql(sql, cursor)

    return {'errno': 0}
