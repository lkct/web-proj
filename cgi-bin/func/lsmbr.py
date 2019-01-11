import cgi
import os
import sys
import json

from mysql import mysql

def lsmbr(form, params):
    """
    params:
        group: group name
    return:
        list: list of {user, is_own}
    """
    group = params['group']

    sql = 'SELECT * FROM belongs WHERE group_name="%s"' % (group)
    result = mysql(sql)
    ret = []
    for ln in result:
        ret.append({'user': ln['user_name'], 'is_own': ln['is_own']})

    stat = '200 OK'
    msg = {'errno': 0, 'list': json.dumps(ret)}
    return (stat, msg)