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
        list: list of {group, is_own}
    """
    user = params['user']

    sql = 'SELECT * FROM belongs WHERE user_name="%s"' % (user)
    result = mysql(sql)
    ret = []
    for ln in result:
        ret.append({'group': ln['group'], 'is_own': ln['is_own']})

    stat = '200 OK'
    msg = {'errno': 0, 'list': json.dumps(ret)}
    return (stat, msg)