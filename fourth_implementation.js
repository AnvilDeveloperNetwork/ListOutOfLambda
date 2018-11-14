function truthy(t, f) {
  return t()
}

function falsey(t, f) {
  return f()
}

function ifelse(conditional, then, el) {
  return conditional(then, el)
}

const nil = function() {}

const empty = function(op) {
  op(nil, nil, truthy)
}

function isEmpty(list) {
  return list(function(h, t, e) {
    return e;
  })
}

function preprend(head, tail) {
  return function(selector) {
    return selector(head, tail, falsey)
  }
}

function head(list) {
  return list(function(head, tail, e) {
    return head;
  })
}

function tail(list) {
  return list(function(head, tail) {
    return tail;
  })
}
