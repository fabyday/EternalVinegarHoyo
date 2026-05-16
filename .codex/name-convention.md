# Name Convention

- **File & Directory under src** : *PascalCase*
    - example : FileName.tsx, Main/, TestCase.ts

- Class, Type, Generic, Interface : PascalCase
    - example : 
        ```ts
        class MyClass{
            ...
        };
        
        class VeryLongNameClass{
            ...
        };

        ```
- Function  Name : snake_case
    - example : 
        ```ts
            function add_library(){

            }
        ```
- method, property, variable, function&method parameter Name : lowerCamelCase
    - example :
        ```ts
            class SomeClass{



                addLibrary(fileName : string): void {
                    ...
                }
            }

            interface SomeInterface{
                someVariable : string
            }

            


        ```

- Enum, global constant Name : UPPERCASE
    - example :
        ```ts
            const MY_CONSTANT = "test";
        ```




