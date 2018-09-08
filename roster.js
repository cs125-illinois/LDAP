#!/usr/bin/env node

'use strict'

require('dotenv').config()
const ldapjs = require('ldapjs')
const bluebird = require('bluebird')

const baseDN = "OU=Classes,OU=UsersAndGroups,OU=Engineering,OU=Urbana,DC=AD,DC=UILLINOIS,DC=EDU"
const tlsOptions = {
  rejectUnauthorized: false
}

const client = ldapjs.createClient({ url: 'ldap://ad.uillinois.edu/', tlsOptions })
//bluebird.promisifyAll(client)

client.starttls(tlsOptions, [], () => {
  console.log("Here")
})
/*
client.bind(process.env.USER, process.env.PASSWORD).then(() => {
  console.log("Here")
})

/*
client.startttls(
client.starttls(tlsOptions,[],function(err) {
    if (err) throw err;
    client.bind(login, passw, function(err) {
        if (err) throw err;

        var searchOptions = {
            filter: `(samaccountname=${group})`,
            scope: 'sub',
        }

        client.search(baseDN, searchOptions, function(err, result) {
            if (err) throw Error(err);

            result.on('searchEntry', function(entry) {
                //console.dir(entry.objectName);
                //console.dir(entry.attributes);
                if ("member" in entry.object) {
                    entry.object.member.forEach(function(member) {
                        printCN(member);
                    });
                }
            });

            result.on('error', function(err) {
                console.error('error: ' + err.message);
            });

            result.on('end', result => {
                //console.log(result.status);
                client.unbind();
            });
        });
    });
})

function printCN(dn) {
    var res = dn.match(/^CN=(.+?),OU/);
    console.log(res[1]);
}
*/
