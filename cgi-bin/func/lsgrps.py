import cgi
import os
import sys
import json

from mysql import mysql

def lsgrps(form, params, cursor):
    """
    params:
        NONE
    return:
        list: list of {group, is_own}
    """
    user = params['user']

    sql = 'SELECT * FROM belongs WHERE user_name="%s"' % (user)
    result = mysql(sql, cursor)
    ret = [{'group': ln['group_name'], 'is_own': ln['is_own']} for ln in result]

    return {'errno': 0, 'list': json.dumps(ret)}