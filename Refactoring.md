# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

`deterministicPartitionKey` is more concise now that some of the code branches have been merged to reduce the amount of paths the code could branch into. Internally, some of the function's interesting parts have been split away from the body of the main function, e.g. `hash` and `toString`, which have a very specific responsibility, which is to compute the resulting hash, and make sure that an incoming `partitionKey` is properly converted to a string. The partition key calculation can now be read in a few readable and explicit statements:

- First, return the trivial key for a falsy event (undefined, null, false, 0).
- Second, if the caller supplied a partition key, use the stringified version of it, otherwise, compute a hash based on the contents of the event object.
- Third, if the partitionKey candidate is longer than the allowed limit, compute a new hash based on this long candidate, which is guaranteed to comply with the length limit.

The original implementation had behaviors that I would consider bugs, such as not being able to accept falsy values such as `0` or `false` as the value of `event.partitionKey`, but I did not change this behavior because of the risk of introducing a breaking change to a function that is already being used.

For code formatting, I used the default "Prettier" settings.

For making sure the `deterministicPartitionKey` function consistently returns deterministic results, I run it multiple times against the same inputs.
