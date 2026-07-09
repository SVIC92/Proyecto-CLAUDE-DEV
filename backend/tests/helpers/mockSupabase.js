// Helper para simular el builder encadenado de supabase-js (select/insert/update/
// delete/eq devuelven el mismo builder; single/maybeSingle y el propio builder
// (thenable) resuelven la promesa final con { data, error }).
function makeBuilder(result) {
  const builder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    single: () => Promise.resolve(result),
    maybeSingle: () => Promise.resolve(result),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };
  return builder;
}

module.exports = { makeBuilder };
