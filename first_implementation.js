/* first implementation of functional lists */
const empty = null

function isEmpty(list) {
  return list === empty
}

function preprend(head, tail) {
  return function(option) {
    if(option === "head") {
      return head
    }
    else if (option === "tail") {
      return tail
    }
  }
}

function head(list) {
  if(!isEmpty(list))
    return list("head")
}

function tail(list) {
  if(!isEmtpy(list))
    return list("tail")
}
