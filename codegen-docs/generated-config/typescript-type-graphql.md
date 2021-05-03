## Installation



<img alt="typescript-type-graphql plugin version" src="https://img.shields.io/npm/v/@graphql-codegen/typescript-type-graphql?color=%23e15799&label=plugin&nbsp;version&style=for-the-badge"/>


    
:::shell Using `yarn`
    yarn add -D @graphql-codegen/typescript-type-graphql
:::

## API Reference

### `decoratorName`

type: `Partial_1`
default: ``{ type: 'ObjectType', interface: 'InterfaceType', arguments: 'ArgsType', field: 'Field', input: 'InputType' }``

allow overriding of TypeGraphQL decorator types


### `decorateTypes`

type: `string[]`

Speciies the objects that will have TypeGraphQL decorators prepended to them, by name. Non-matching types will still be output, but without decorators. If not set, all types will be decorated.


### `avoidOptionals`

type: `AvoidOptionalsConfig | boolean`
default: `false`

This will cause the generator to avoid using TypeScript optionals (`?`) on types,
so the following definition: `type A { myField: String }` will output `myField: Maybe<string>`
instead of `myField?: Maybe<string>`.

#### Usage Examples

##### Override all definition types
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   avoidOptionals: true
```

##### Override only specific definition types
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   avoidOptionals:
     field: true
     inputValue: true
     object: true
     defaultValue: true
```

### `constEnums`

type: `boolean`
default: `false`

Will prefix every generated `enum` with `const`, you can read more about const enums here: https://www.typescriptlang.org/docs/handbook/enums.html.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   constEnums: true
```

### `enumsAsTypes`

type: `boolean`
default: `false`

Generates enum as TypeScript `type` instead of `enum`. Useful it you wish to generate `.d.ts` declaration file instead of `.ts`

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   enumsAsTypes: true
```

### `numericEnums`

type: `boolean`
default: `false`

Controls whether to preserve typescript enum values as numbers

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   numericEnums: true
```

### `futureProofEnums`

type: `boolean`
default: `false`

This option controls whether or not a catch-all entry is added to enum type definitions for values that may be added in the future. You also have to set `enumsAsTypes` to true if you wish to use this option.
This is useful if you are using `relay`.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   enumsAsTypes: true
   futureProofEnums: true
```

### `futureProofUnions`

type: `boolean`
default: `false`

This option controls whether or not a catch-all entry is added to union type definitions for values that may be added in the future.
This is useful if you are using `relay`.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   futureProofUnions: true
```

### `enumsAsConst`

type: `boolean`
default: `false`

Generates enum as TypeScript `const assertions` instead of `enum`. This can even be used to enable enum-like patterns in plain JavaScript code if you choose not to use TypeScript’s enum construct.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   enumsAsConst: true
```

### `onlyOperationTypes`

type: `boolean`
default: `false`

This will cause the generator to emit types for operations only (basically only enums and scalars).
Interacts well with `preResolveTypes: true`

#### Usage Examples

Override all definition types
```yml
generates:
path/to/file.ts:
plugins:
- typescript
config:
onlyOperationTypes: true
```

### `immutableTypes`

type: `boolean`
default: `false`

Generates immutable types by adding `readonly` to properties and uses `ReadonlyArray`.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   immutableTypes: true
```

### `maybeValue`

type: `string`
default: `T | null`

Allow to override the type value of `Maybe`.

#### Usage Examples

##### Allow undefined
```yml
generates:
 path/to/file.ts:
   plugins:
     - typescript
   config:
     maybeValue: T | null | undefined
```

##### Allow `null` in resolvers:
```yml
generates:
 path/to/file.ts:
   plugins:
     - typescript
     - typescript-resolvers
   config:
     maybeValue: 'T extends PromiseLike<infer U> ? Promise<U | null> : T | null'
```

### `noExport`

type: `boolean`
default: `false`

Set to `true` in order to generate output without `export` modifier.
This is useful if you are generating `.d.ts` file and want it to be globally available.

#### Usage Examples

##### Disable all export from a file
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   noExport: true
```

### `disableDescriptions`

type: `boolean`
default: `false`

Set the value to `true` in order to disable all description generation.

#### Usage Examples

##### Disable description generation
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   disableDescriptions: true
```

### `useImplementingTypes`

type: `boolean`
default: `false`

When a GraphQL interface is used for a field, this flag will use the implementing types, instead of the interface itself.

#### Usage Examples

##### Override all definition types
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   useImplementingTypes: true
```

### `addUnderscoreToArgsType`

type: `boolean`

Adds `_` to generated `Args` types in order to avoid duplicate identifiers.

#### Usage Examples

##### With Custom Values
```yml
  config:
    addUnderscoreToArgsType: true
```

### `enumValues`

type: `EnumValuesMap`

Overrides the default value of enum values declared in your GraphQL schema.
You can also map the entire enum to an external type by providing a string that of `module#type`.


### `declarationKind`

type: `DeclarationKindConfig | string (values: abstract class, class, interface, type)`

Overrides the default output for various GraphQL elements.

#### Usage Examples

##### Override all declarations
```yml
  config:
    declarationKind: 'interface'
```

##### Override only specific declarations
```yml
  config:
    declarationKind:
      type: 'interface'
      input: 'interface'
```

### `enumPrefix`

type: `boolean`
default: `true`

Allow you to disable prefixing for generated enums, works in combination with `typesPrefix`.

#### Usage Examples

##### Disable enum prefixes
```yml
  config:
    typesPrefix: I
    enumPrefix: false
```

### `fieldWrapperValue`

type: `string`
default: `T`

Allow you to add wrapper for field type, use T as the generic value. Make sure to set `wrapFieldDefinitions` to `true` in order to make this flag work.

#### Usage Examples

##### Allow Promise
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   wrapFieldDefinitions: true
   fieldWrapperValue: T | Promise<T>
```

### `wrapFieldDefinitions`

type: `boolean`
default: `false`

Set the to `true` in order to wrap field definitions with `FieldWrapper`.
This is useful to allow return types such as Promises and functions.

#### Usage Examples

##### Enable wrapping fields
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   wrapFieldDefinitions: true
```

### `ignoreEnumValuesFromSchema`

type: `boolean`
default: `false`

This will cause the generator to ignore enum values defined in GraphQLSchema

#### Usage Examples

##### Ignore enum values from schema
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   ignoreEnumValuesFromSchema: true
```

### `scalars`

type: `ScalarsMap`

Extends or overrides the built-in scalars and custom GraphQL scalars to a custom type.


### `namingConvention`

type: `NamingConvention`
default: `change-case-all#pascalCase`

Allow you to override the naming convention of the output.
You can either override all namings, or specify an object with specific custom naming convention per output.
The format of the converter must be a valid `module#method`.
Allowed values for specific output are: `typeNames`, `enumValues`.
You can also use "keep" to keep all GraphQL names as-is.
Additionally you can set `transformUnderscore` to `true` if you want to override the default behavior,
which is to preserves underscores.

Available case functions in `change-case-all` are `camelCase`, `capitalCase`, `constantCase`, `dotCase`, `headerCase`, `noCase`, `paramCase`, `pascalCase`, `pathCase`, `sentenceCase`, `snakeCase`, `lowerCase`, `localeLowerCase`, `lowerCaseFirst`, `spongeCase`, `titleCase`, `upperCase`, `localeUpperCase` and `upperCaseFirst`
[See more](https://github.com/btxtiger/change-case-all)


### `typesPrefix`

type: `string`
default: ``

Prefixes all the generated types.

#### Usage Examples

```yml
config:
  typesPrefix: I
```

### `typesSuffix`

type: `string`
default: ``

Suffixes all the generated types.

#### Usage Examples

```yml
config:
  typesSuffix: I
```

### `skipTypename`

type: `boolean`
default: `false`

Does not add __typename to the generated types, unless it was specified in the selection set.

#### Usage Examples

```yml
config:
  skipTypename: true
```

### `nonOptionalTypename`

type: `boolean`
default: `false`

Automatically adds `__typename` field to the generated types, even when they are not specified
in the selection set, and makes it non-optional

#### Usage Examples

```yml
config:
  nonOptionalTypename: true
```

### `useTypeImports`

type: `boolean`
default: `false`

Will use `import type {}` rather than `import {}` when importing only types. This gives
compatibility with TypeScript's "importsNotUsedAsValues": "error" option