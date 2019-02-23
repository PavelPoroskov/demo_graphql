function info(parent, args, context, info) {
  return "This is the API of a Hackernews Clone"
}

async function feed(parent, args, context, info) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const awLinks = context.prisma.links({
    where,
    after: args.after, 
    first: args.first,
    orderBy: args.orderBy,
  })
  const awCount = context.prisma
    .linksConnection({
      where,
    })
    .aggregate()
    .count()
  // const awCount = context.prisma.linksConnection({ where, })
  //   .then( res => res.aggregate() )
  //   .then( res => res.count )

  //const links = await awLinks
  //const count = await awCount

  let [links, count] = await Promise.all([awLinks, awCount]);
  // console.log('uery/feed/count')
  // console.log(count)
  // console.log(links)

  return {
    links,
    count,
  }  
}
function link(parent, args, context, info) {
  return context.prisma.link({ id: args.id })
}

module.exports = {
  info,
  feed,
  link,
}