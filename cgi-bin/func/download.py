import cgi
import os
import sys
import random
import string
import json

from mysql import mysql
from rsa import encrypt
from token import generate


def download(form, params, cursor):
    """
    params:
        filename: name of file
        path: directory of file, start with /
    return:
        dl_token: token to download link
    """
    fn = params['filename']
    fpath = params['path']

    sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (fpath, fn)
    result = mysql(sql, cursor)
    md5 = result[0]['md5']
    sql = 'SELECT * FROM md5_list WHERE md5="%s"' % (md5)
    result = mysql(sql, cursor)
    srv_id = result[0]['srv_id']
    sql = 'SELECT * FROM file_server WHERE srv_id=%d' % (srv_id)
    result = mysql(sql, cursor)
    file_srv = result[0]['file_srv']

    dl_msg = {'filename': fn, 'md5': md5, 'file_srv': file_srv}
    dl_msg = encrypt(json.dumps(dl_msg))
    dl_token = generate({'dl_msg': dl_msg}, 3600)

    return {'errno': 0, 'dl_token': dl_token}
