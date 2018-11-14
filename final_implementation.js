/* es6 refactor of fourthImplementation*/

const truthy = (t, f) => t()
const falsey = (t, f) => f()
const ifelse = (cond, then, el) => cond(then, el)

const nil = _ => {}

const empty = selector => selector(nil, nil, truthy)

const isEmpty = list => list((h, t, e) => e)

const prepend = (head, tail) => (selector) => selector(head, tail, falsey)

const head = list => list((head, tail) => head)
const tail = list => list((head, tail) => tail)


/***** More List Helper Functions ******/

const length = list => ifelse(isEmpty(list), _ => 0, _ => 1 + length(tail(list)))
const map = (f, list) => ifelse(isEmpty(list), _ => empty, prepend(f(head(list)), map(f, tail(list))))
const filter = (f, list) => ifelse(isEmpty(list), _ => empty, )

/**************************************/
