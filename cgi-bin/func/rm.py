import cgi
import os
import sys

from mysql import rm_r

def rm(form, params):
    """
    params:
        filename: name of file
        path: directory of file, start with /
    return:
        NONE
    """
    fn = params['filename']
    fpath = params['path']

    rm_r(fpath, fn)

    msg = {'errno': 0}
    return msg