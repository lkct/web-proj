import cgi
import os
import sys
import json

from mysql import mysql

def lsgrps(form, params):
    """
    params:
        NONE
    return:
        list: list of {group_name, is_own}
    """
    user = params['user']

    sql = 'SELECT * FROM belongs WHERE user_name="%s"' % (user)
    result = mysql(sql)
    ret = [{'group': ln['group_name'], 'is_own': ln['is_own']} for ln in result]

    stat = '200 OK'
    msg = {'errno': 0, 'list': json.dumps(ret)}
    return (stat, msg)