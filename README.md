# ffc-diff-json

A diff tool for javascript objects inspired by https://github.com/viruschidai/diff-json.

## Features

### diff

If a key is specified for an embedded array, the diff will be generated based on the objects have same keys.

#### Examples:

```javascript

  var changesets = require('diff-json');
  var newObj, oldObj;

  oldObj = {
    name: 'joe',
    age: 55,
    coins: [2, 5],
    children: [
      {name: 'kid1', age: 1},
      {name: 'kid2', age: 2}
    ]};

  newObj = {
    name: 'smith',
    coins: [2, 5, 1],
    children: [
      {name: 'kid3', age: 3},
      {name: 'kid1', age: 0},
      {name: 'kid2', age: 2}
    ]};


  # Assume children is an array of child object and the child object has 'name' as its primary key
  const diffs = changesets.diff(oldObj, newObj, {children: 'name'});
```

### applyChange
#### Examples:

```javascript

  var changesets = require('diff-json');
  var oldObj = {
    name: 'joe',
    age: 55,
    coins: [2, 5],
    children: [
      {name: 'kid1', age: 1},
      {name: 'kid2', age: 2}
    ]};


  # Assume children is an array of child object and the child object has 'name' as its primary key
  diffs = [
    {
      type: 'update', key: 'name', value: 'smith', oldValue: 'joe'
    },
    {
      type: 'update', key: 'coins', embededKey: '$index', changes: [
          {type: 'add', key: '2', value: 1 }
        ]
    },
    {
      type: 'update',
      key: 'children',
      embededKey: 'name', // The key property name of the elements in an array
      changes: [
        {
          type: 'update', key: 'kid1', changes: [
            {type: 'update', key: 'age', value: 0, oldValue: 1 }
          ]
        },
        {
          type: 'add', key: 'kid3', value: {name: 'kid3', age: 3 }
        }
      ]
    },
    {
      type: 'remove', key: 'age', value: 55
    }
  ]

  const result = changesets.applyChanges(oldObj, diffs);
```

### revertChange
#### Examples:

```javascript

  var changesets = require('diff-json');

  var newObj = {
    name: 'smith',
    coins: [2, 5, 1],
    children: [
      {name: 'kid3', age: 3},
      {name: 'kid1', age: 0},
      {name: 'kid2', age: 2}
   ]};

  # Assume children is an array of child object and the child object has 'name' as its primary key
  diffs =  [
    {
      type: 'update', key: 'name', value: 'smith', oldValue: 'joe'
    },
    {
      type: 'update', key: 'coins', embededKey: '$index', changes: [
          {type: 'add', key: '2', value: 1 }
        ]
    },
    {
      type: 'update',
      key: 'children',
      embededKey: 'name', // The key property name of the elements in an array
      changes: [
        {
          type: 'update', key: 'kid1', changes: [
            {type: 'update', key: 'age', value: 0, oldValue: 1 }
          ]
        },
        {
          type: 'add', key: 'kid3', value: {name: 'kid3', age: 3 }
        }
      ]
    },
    {
      type: 'remove', key: 'age', value: 55
    }
  ]

  const result = changesets.revertChanges(newObj, diffs)
```

## Get started

```
npm install ffc-json-diff
```