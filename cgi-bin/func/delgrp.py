import cgi
import os
import sys

from mysql import mysql
from mysql import rm_r

def delgrp(form, params):
    """
    params:
        group: group name
    return:
        NONE
    """
    group = params['group']

    sql = 'DELETE FROM belongs WHERE group_name="%s"' % (group)
    mysql(sql)
    rm_r('/', 'group')

    stat = '200 OK'
    msg = {'errno': 0}
    return (stat, msg)