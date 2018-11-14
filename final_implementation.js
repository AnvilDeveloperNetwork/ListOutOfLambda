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

/***** Create List Helper ******/

const createList = (...args) => args.reverse().reduce((acc, el) => prepend(el, acc), empty)

/*******************************/

/***** More List Helper Functions ******/

const length = list => ifelse(isEmpty(list),
                                _ => 0,
                                _ => 1 + length(tail(list)))

const map = (f, list) => ifelse(isEmpty(list),
                                  _ => empty,
                                  _ => prepend(f(head(list)), map(f, tail(list))))

const filter = (f, list) => ifelse(isEmpty(list),
                                    _ => empty,
                                    _ => ifelse(f(head(list)),
                                              _ => prepend(head(list), filter(f, tail(list))),
                                              _ => filter(f, tail(list))))
/**************************************/
