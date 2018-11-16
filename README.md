# Lists out of Lambda + Church Encodings
In this article we'll be walking through a programming exercise. This isn't a presentation on a new technology or concept, but instead we're going to expand on some old ones. One in particular: functions.

I got the idea for this talk/article from another article called [List out of Lambda](http://stevelosh.com/blog/2013/03/list-out-of-lambda/) by [Steve Losh](https://github.com/sjl). I highly recommend taking the time to read this article. I'm going to expand on what List out of Lambda provides and go a little futher while also leaving out some of the additional info the article goes in to (again, go read list out of lambda because it's awesome).

## Goals:
Learn to think more abstractly about language functionality.
The goal of today is to rebuild language functionality without the provided tools given by the language. We'll be writing a javascript list data structure using **nothing** but functions.

## Disclaimer:
You will not take any of this code back to your desk and push it to the next deployment. Much of this isn't practical code to write, but the concepts are still valuable to understand.

## Prereqs:
To get the most out of this, you will need to know a bit about javascript functions (specifically how closures work).
Here is a quick example that will prepare you for what's to come.
```javascript

const x = 5

function f(x) {
  return function() {
    console.log(x)
  }
}

const g = f(4)

g()  // <--- What's the output?
     // Answer: 4
```

How does this work? By returning a function from within a function you not only get the returned function when called, but the returned function also gets access to its outer environment at the time it was created.


Another quick closure example:

```javascript
function multiplyBy(x) {
  return function(y) {
    return x * y
  }
}

const double = multiplyBy(2)  // we've just created a specialized function

double(4)   // 8
double(12)  // 24
```

## Let's Begin
___

What if Javascript didn't provide us with a list-like structure? No arrays, no objects. Is it possible to build our own?

First, let's build some criteria for this list structure.

Wish List (pun intended):
1) We need some concept of an empty list.
2) We need to be able to prepend items to the list.
3) We need to be able to get the head and tail of the list.

So, this may sound very familiar to a linked list in many ways. However, we won't be using direct memory references to chain
items together. Instead we'll be using closures to chain items together.

Here is the list functionality we'd like to have. (This isn't valid javascript, this is just to give you some idea of our end goal.)

(In this example lists are denoted with parenthesis: `(1 2 3 4)`)
```clojure
isEmpty ()          // true
isEmpty (1)         // false
head (1 2 3 4 5)    // 1
tail (1 2 3 4 5)    // (2 3 4 5)
prepend 1 (2 3 4 5) // (1 2 3 4 5)
```


We'll start with the basics: the empty list. How will we define the empty list?
`null` seems appropriate for now. So, we're able to implement one of our functions.

```javascript
const empty = null

function isEmpty(list) {
  return list === empty
}

function prepend(head, tail) {
  //TODO
}

function head(list) {
  //TODO
}

function tail(list) {
  //TODO
}
```

Now let's implement `prepend`. This is the hardest function to wrap your head around. Take a minute to read the prepend implementation below and think of how you might write head and tail. The goal of prepend is to add an element to the beginning of an existing list structure.

```javascript
const empty = null

function isEmpty(list) {
  return list === empty
}

// head will be the element to prepend to another list, tail.
function prepend(head, tail) {
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
  //TODO
}

function tail(list) {
  //TODO
}
```

Be sure you understand what the prepend function is doing before you continue...

Remember that when we return a function from another function the returned function also gets access to the outer environment where it was defined. So, in the case of `prepend` the function returned has access to both the `head` and `tail`.

With this in mind, how should head and tail be implemented? Remember that the head and tail functions are just given a list as an argument.

For now we won't worry about error cases (calling head and tail on the empty list). So, assuming our head and tail functions receive an unempty list let's return the head and tail respectively.

```javascript
const empty = null

function isEmpty(list) {
  return list === empty
}

function prepend(head, tail) {
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
```
Now we have all the functions we set out to create! But, how do we actually make and use our list structure?
We wrap up multiple calls to prepend!

```javascript
const myList = prepend(1, prepend(2, prepend(3, empty)))
head(myList)  // 1
tail(myList)  // prepend(2, prepend( 3, empty))
```
WE HAVE A LIST!
But where is the data stored? In the closure of each function call!

*Quick Aside:
If you'd like to do some playing around with lists but don't want to keep typing all the prepend calls just use this function for some quick list creation.*
```javascript
const createList = (...args) => args.reverse().reduce((acc, el) => prepend(el, acc), empty)

// Usage:
const disappointing_movies = createList("Shrek 3",
                                        "Mighty Ducks 2",
                                        "The Last Airbender",
                                        "Eragon",
                                        "Man of Steel")
```

To get more familar with this let's write some list operations using our awesome new list strctures!

```javascript
function length() {
  //TODO
}
// length((1 2 3)) // 3

function map(list) {
  //TODO
}

// map(function(n){ return n * 2 }, (1 2 3))  // (2 4 6)

function filter(list) {
  //TODO
}
// filter(function(n){ return n > 10 }, (1 12 32 6))  // (12 32)
```

Implementations:
```javascript

function length(list) {
  if(isEmpty(list)) {
    return 0;
  }
  else {
    return 1 + length(tail(list))
  }
}

function map(f, list) {
  if(isEmpty(list)) {
    return list;
  }
  const h = head(list)
  const t = tail(list)
  return prepend(f(h), map(f, t));
}

function filter(f, list) {
  if(isEmpty(list)) {
    return list;
  }

  const h = head(list)
  const t = tail(list)
  if(f(h)) {
    return prepend(h, filter(f, t))
  }
  else {
    return filter(f, t)
  }
}
```

Take some time to use some of these list helpers or maybe write a few new list helpers to get you more comfortable with the lists we've made.

Our current list structure works, but we're using a bit of unneeded language functionality.
We're using:
- functions
- strings
- booleans/equality expressions
- if/else statements

Let's start by removing the usage of strings inside our prepend.

```javascript
const empty = null

function isEmpty(list) {
  return list === empty
}

function prepend(head, tail) {
  return function(select) {
    return select(head, tail)
  }
}

function head(list) {
  return list(function(head, tail) {
    return head
  })
}

function tail(list) {
  return list(function(head, tail) {
    return tail
  })
}
```

No more strings! So, how does this work?

All head and tail need are access to the actual head and tail of a list. In our case lists are just functions, so we can give our list a select function that we can call with the values of head and tail.

Walkthrough:
```javascript
const tear_worthy_movies = prepend("Cast Away", empty)
head(tear_worthy_movies)


/*
Step by step:
1.) const myList = prepend(1, empty)

2.) const myList = function(op) {
      return op(1, empty)
    }

3.) head(myList)

4.) head(myList)

5.) (function(list){
      return list(function(head, tail) {
        return head;
      })
    })(myList)

6.) myList(function(head, tail) {
       return head
    })

7.) (function(op) {
      return op(1, empty)
    })(function(head, tail) {
       return head
    })

 8.) (function(head, tail) { return head })(1, empty)

 9.) 1
*/
```

That was a lot of logic to trace through, but after some more examples it will start to click.

We are now down to using
- functions
- booleans/equality expressions
- if/else statements

Let's remove those if/else statements

Currently if/else statements are only being used to test if a list is empty. One way to avoid this is to tag each list with being empty or not being empty. To do this we have to change the value of the empty list from null to a function that tags the "list" as empty. The empty function will look similar to the prepend function, but doesn't need any reference to a head or tail.

We will add an additional parameter to our `selector` function that will either be true or false that represents whether or not the list is empty.

```javascript
const empty = function(select) {
  return select(null, null, true) // the last argument here decides that this list is empty
}

function isEmpty(list) {
  return list(function(head, tail, isempty) {
    return isempty
  })
}

function prepend(head, tail) {
  return function(select) {
    return select(head, tail, false)
  }
}

function head(list) {
  return list(function(head, tail, isempty) {
    return head
  })
}

function tail(list) {
  return list(function(head, tail, isempty) {
    return tail
  })
}
```

Our list structure is looking great! We're only using `functions` and `booleans` our data structure.
We've come quite a long way since our very first iteration, but more work can still be done. We need to remove those booleans. How can we do this though? We need some way to determine if a list is empty which means we need a way to run conditional expressions. Let's try rewriting conditionals using functions. Sounds a bit daunting, but it's doable.


Once again let's take a second to review our criteria for the structure we are trying to build:
1.) Need to provide constants for both true and false options.
2.) Need to use these constants to choose between two things (essentially `if/else` statements)

We're going to write our true and false values as functions that choose between two things.
```javascript
function truthy(t, f) {
  return t
}

function falsey(t, f) {
  return f
}
```

Our function truthy takes two things and always returns the first and our falsey function takes two things and always returns the latter.

How are these going to be used as true and false values???

Without much context these don't make a lot of sense, but the implementation of `ifelse` should shine a bit of light on this.

```javascript
function ifelse(conditional, then, else) {
  return conditional(then, else)
}
```
The conditional that is passed into `ifelse` will always be either `truthy` or `falsey`.

A few examples:

```javascript
function truthy(t, f) {
  return t
}

function falsey(t, f) {
  return f
}

function ifelse(conditional, then, el) {
  return conditional(then, el)
}

// Example usage:
const a = ifelse(truthy, 1, 2)  // 1
const b = ifelse(falsey, "it was TRUE!", "sorry... it was false.") // "sorry.. it was false."
```

We just wrote if/else functionality with nothing but javascript functions!

Great, but how do we apply this to our lists?
We should just be able to replace the usages of true and false with truthy and falsey.

```javascript
const empty = function(op) {
  op(null, null, truthy)
}

function isEmpty(list) {
  return list(function(head, tail, isempty) {
    return isempty
  })
}

function prepend(head, tail) {
  return function(op) {
    return op(head, tail, falsey)
  }
}

function head(list) {
  return list(function(head, tail, isempty) {
    return head
  })
}

function tail(list) {
  return list(function(head, tail, isempty) {
    return tail
  })
}
```

This begs the question though: Why did we write `ifelse`?

Well, we need it for `isEmpty` to be usable inside our other list functions.
Our old implementations of things like `length`, `map`, and `filter` relied on our old implementation of `isEmpty`, but that doesn't work anymore because javascript's native if/else statements won't work with our `truthy` and `falsey` values that are returned by our new `isEmtpy` implementation.

Time for a **refactor**!

Let's implement length again using our newly formed lists.

```javascript
function length(list) {
  return ifelse(isEmpty(list),
              0,
              1 + length(tail(list)))
}
```
Seems pretty simple, but there is a problem. The problem is one we can't avoid because the issue is engrained at the language level of javascript.

To find the problem imagine we called length on the empty list.
```javascript
length(empty)
/* the above line would produce the following code:
  ifelse(isEmpty(list),
         0,
         1 + length(tail(list)))
*/
```
Even though our list is empty and the only branch that should execute is the `0`, the `1 + length(tail(list))` will still be run because ifelse is just a function and `1 + length(tail(list))` is an argument we've given to that function. The `1 + length(tail(list))` will be evaluated regardless of the outcome of `isEmpty(list)`.

So, how can we avoid this issue? How do we postpone execution until we must execute a specific branch of the ifelse function? The answer to this question is the same as the answer to almost every question asked so far: functions!

```javascript
function length(list) {
  const zero = function() {
    return 0
  }

  const tail_length = function() {
    return 1 + length(tail(list))
  }

  return ifelse(isEmpty(list), zero, tail_length)
}
```

aaand this also requires us to change our original booleans as well from this:

```javascript
function truthy(t, f) {
  return t
}

function falsey(t, f) {
  return f
}
```

to this:

```javascript
function truthy(t, f) {
  return t()
}

function falsey(t, f) {
  return f()
}
```

Which leaves us with our final implementation for lists:
```javascript

function truthy(t, f) {
  return t()
}

function falsey(t, f) {
  return f()
}

function ifelse(conditional, then, else) {
  return conditional(then, else)
}

const nil = function() {} // added this for the sake of completion

const empty = function(op) {
  op(nil, nil, truthy)
}

function isEmpty(list) {
  return list(function(h, t, e) {
    return e
  })
}

function prepend(head, tail) {
  return function(op) {
    return op(head, tail, falsey)
  }
}

function head(list) {
  return list(function(head, tail, e) {
    return head
  })
}

function tail(list) {
  return list(function(head, tail) {
    return tail
  })
}
```

We've finally arrived at our end goal! This is a list data structure using nothing but javascript functions.
Mess around with this more and see what other language functionality you can create by using functions (let expressions, loops, numbers). Hopefully this exercise forced you to think a little differently. Trying to build something with limited language functionality often leads to very creative solutions that you wouldn't be exposed to in your day-to-day programming.
