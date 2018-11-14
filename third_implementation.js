/* second implementation of functional lists */
const empty = function(selector) {
    return selector(null, null, true)
}

function isEmpty(list) {
  return list(function(head, tail, empty) {
    return empty
  })
}

function preprend(head, tail) {
  return function(selector) {
    return selector(head, tail, false)
  }
}

function head(list) {
  if(!isEmpty(list)) {
    return list(function(head, tail) {
      return head
    })
  }
}

function tail(list) {
  if(!isEmtpy(list)) {
    return list(function(head, tail) {
      return tail
    })
  }
}
