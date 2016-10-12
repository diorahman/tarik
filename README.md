# Tarik

- minimalist, fast.
- node 6.1.2 required.
- <3

## Test (after server cached the request)

```
$ time node test.js
{ rss: 62304256, heapTotal: 54562816, heapUsed: 32404952 }
real    0m0.559s
user    0m0.232s
sys    0m0.038s
```

test2.js uses request-promise. And the result is not parsed yet.

```
$ time node test2.js
{ rss: 96698368, heapTotal: 77275136, heapUsed: 56795872 }
real    0m0.851s
user    0m0.494s
sys    0m0.066s
```
