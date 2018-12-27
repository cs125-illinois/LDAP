#!/usr/bin/env node

'use strict'

const _ = require('lodash')

const chai = require('chai')
const expect = chai.expect
chai.use(require('dirty-chai'))

require('dotenv').config()
const LDAP = require('promised-ldap')

//const classesDN = "OU=Classes,OU=UsersAndGroups,OU=Engineering,OU=Urbana,DC=AD,DC=UILLINOIS,DC=EDU"
const classesDN = "OU=Sections,OU=Class Rosters,OU=Register,OU=Urbana,DC=ad,DC=uillinois,DC=edu"
const peopleDN = "OU=People,DC=AD,DC=UILLINOIS,DC=EDU"

const debug = require('debug')('roster')

const client = new LDAP({ url: 'ldap://ad.uillinois.edu/' })
client.starttls({}, []).then(async () => {
  const login = await client.bind(process.env.ADUSER, process.env.ADPASSWORD)
  const results = await client.search(classesDN, {
    filter: `(CN=CS 125 AL2 2019 Spring*)`, scope: 'sub'
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
    console.log(results.entries[0].object)
    process.exit(0)
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
  console.log(_.keys(students).length)

  client.unbind()
})

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason.stack || reason)
})
