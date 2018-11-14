/* second implementation of functional lists */
const empty = null

function isEmpty(list) {
  return list === empty
}

function preprend(head, tail) {
  return function(selector) {
    return selector(head, tail)
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
