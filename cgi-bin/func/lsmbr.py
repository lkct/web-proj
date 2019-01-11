import cgi
import os
import sys
import json

from mysql import mysql

def lsmbr(form, params, cursor):
    """
    params:
        group: group name
    return:
        list: list of {user, is_own}
    """
    group = params['group']

    sql = 'SELECT * FROM belongs WHERE group_name="%s"' % (group)
    result = mysql(sql, cursor)
    ret = [{'user': ln['user_name'], 'is_own': ln['is_own']} for ln in result]

    msg = {'errno': 0, 'list': json.dumps(ret)}
    return msg