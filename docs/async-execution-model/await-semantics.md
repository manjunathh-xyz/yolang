# Await Semantics

Await pauses execution until an asynchronous operation completes.

## Why this exists

Await provides a way to write asynchronous code that looks synchronous, improving readability.

## How it works

When await is encountered, the current function yields control back to the event loop. When the awaited operation completes, execution resumes.

## Examples

```kx
fn fetchUser(id) {
  set response = await httpGet("api/users/" + id)
  return parseJson(response)
}

fn getUserData() {
  set user = await fetchUser(123)
  set posts = await fetchPosts(user.id)
  return { user: user, posts: posts }
}

# Usage
set data = await getUserData()
say data.user.name
```

## Common mistakes

- Using await outside async functions
- Forgetting that await returns the operation's result
- Blocking the event loop with synchronous operations

## Related topics

- [Event Loop Model](event-loop-model.md)
- [Async Functions](../functions/async-functions.md)
- [Async Errors](../error-handling/async-errors.md)
