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
    skip: args.skip, 
    first: args.first,
    orderBy: args.orderBy,
  })
  const awCount = context.prisma
    .linksConnection({
      where,
    })
    .aggregate()
    .count()

  let [links, count] = await Promise.all([awLinks, awCount]);

  return {
    links,
    count,
  }  
}
async function feedConnection(parent, _args, context, info) {
  const {filter, ...restArgs} = _args
  const where = filter ? {
    OR: [
      { description_contains: filter },
      { url_contains: filter },
    ],
  } : {}

  const linksConnection = await context.prisma.linksConnection({
    where,
    ...restArgs
  })

  return linksConnection
}
function link(parent, args, context, info) {
  return context.prisma.link({ id: args.id })
}

module.exports = {
  info,
  feed,
  feedConnection,
  link,
}