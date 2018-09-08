#!/usr/bin/env node

'use strict'

const _ = require('lodash')

const chai = require('chai')
const expect = chai.expect
chai.use(require('dirty-chai'))

require('dotenv').config()
const LDAP = require('promised-ldap')

const classesDN = "OU=Classes,OU=UsersAndGroups,OU=Engineering,OU=Urbana,DC=AD,DC=UILLINOIS,DC=EDU"
const peopleDN = "OU=People,DC=AD,DC=UILLINOIS,DC=EDU"

const client = new LDAP({ url: 'ldap://ad.uillinois.edu/' })
client.starttls({}, []).then(async () => {
  const login = await client.bind(process.env.ADUSER, process.env.ADPASSWORD)
  const results = await client.search(classesDN, {
    filter: `(samaccountname=${ process.env.ADGROUP })`, scope: 'sub'
  })
  expect(results.entries.length).to.equal(1)

  const netIDs = _(results.entries[0].object.member).map(member => {
    const [ unused, netID, group ] = /^CN=(.+?),OU=(.+?),/.exec(member)
    return group === 'People' ? netID : null
  }).filter(member => {
    return member !== null
  }).value()

  expect(netIDs.length).to.be.at.least(1)

  let students = {}
  for (let netID of netIDs) {
    const results = await client.search(peopleDN, {
      filter: `(cn=${ netID })`, scope: 'sub'
    })
    expect(results.entries.length).to.equal(1)
    const { givenName: first, sn: last, mail: email } = results.entries[0].object
    expect(students).to.not.have.property(email)
    students[email] = {
      email,
      name: {
        first, last, full: `${ first } ${ last }`
      }
    }
  }
  expect(_.keys(students).length).to.equal(netIDs.length)

  console.log(JSON.stringify(students, null, 2))
  client.unbind()
})

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason.stack || reason)
})
