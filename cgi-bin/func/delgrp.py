import cgi
import os
import sys

from mysql import mysql
from mysql import rm_r

def delgrp(form, params, cursor):
    """
    params:
        group: group name
    return:
        NONE
    """
    group = params['group']

    sql = 'DELETE FROM belongs WHERE group_name="%s"' % (group)
    mysql(sql, cursor)
    rm_r(cursor, '/', group)

    return {'errno': 0}