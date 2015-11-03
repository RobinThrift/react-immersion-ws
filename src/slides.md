title: React Immersion Workshop
author: Robin Thrift
twitter: RobinThrift
homepage: RobinThrift.com
shortcodes: true
css:
    - 'http://fonts.googleapis.com/css?family=Droid+Sans:400,700|Source+Code+Pro|Kaushan+Script'
reveal:
    controls: true
    progress: true
    slideNumber: true
    history: true
    keyboard: true
    overview: true
    transition: 'linear'
    backgroundTransition: 'slide'
    showNotes: true
    dependencies:
        - src: 'scripts/plugins/notes.js'
          async: true

-- {
    background: 
        img: '#cb5243'
}

# [var title]

<div class="author-info">
    <h5>[var author]</h5>
    <h5>Jr. Dev, NewStore</h5>
    <a href="http://twitter.com/[var twitter]">@[var twitter]</a>
</div>

--

### Outline
- Basics
- Components
- State
- Props
- Refs
- Context
- Lifecycle Methods
- Testing
- Flux
- React Native APIs
- TypeScript

--

## Basics

--

### "A JavaScript library for building [accented]user interfaces[/accented]"

-- {
    transition: 'slide-in none-out'
    classes: 
        - 'mvc-overview'
}

- <strong>M</strong>odel
- <strong>V</strong>iew
- <strong>C</strong>ontroller

-- {
    transition: 'none-in slide-out'
    classes: 
        - 'mvc-overview'
        - 'mvc-overview__2'
}

- <strong>M</strong>odel
- <strong>V</strong>iew
- <strong>C</strong>ontroller

--

### Everything Is A Component

--

### "Reduce [emphasize]Coupling[/emphasize], increase [emphasize]Cohesion[/emphasize]"

--

### Immutability

- no bindings
- no DOM events
- when the Compontents change:   
rerender entire DOM

--

### Virtual DOM
[fragment]
It's just like the real DOM
[/fragment]

[fragment]
But fast!
[/fragment]

-- 

- mimics the real DOM

[fragment]
- renders only the difference

`diff: (Tree, Tree) → ∆Tree`
[/fragment]

[fragment]
Tree Diffing is usually ∈ O(n<sup>3</sup>)!
[/fragment]

[fragment]
By using heurstics, Reacts Diffing Algorithm ∈ O(n)  
[small][More](https://facebook.github.io/react/docs/reconciliation.html)[/small]
[/fragment]

--

### JSX

--

```js
render() {
    return <div>Hello World, at {new Date().toString()}</div>;
}
```
⟱ JSX Transformer ⟱
```js
render() {
    return React.createElement('div', {}, 
        'Hello World, at ', new Date().toString());
}
```

--

```js
class App extends React.Component {
    render() {
        return (
            <div className="main">
                <div className="picture-bg">
                    <img src={getRandomBg()} />
                </div>
                <Clock />
                <CmdLine ps1="λ" />
                <LinksBox />
            </div>
        );
    }
}
```

--

```js
class Clock extends React.Component {
    render() {
        let time = moment().format(this.props.format);
        return (<time>{time}</time>);
    }
}
```

```js
// ...
    render() {
        return (<div><Clock format="HH:mm" /></div>);
    }
// ...
```

--

## Let's Talk About Components

--

### Everything Is A Component

--

### Components can be composed

--

### Components are meant to be composed

-- {
    notes: |
        - pretend it does not exist
        - moving away from OOP/architecture
        - we don't need it
        - enter:
}

### Throw away `extends`[emphasize]*[/emphasize]
[fragment]
##### [emphasize]*[/emphasize]almost
[/fragment]

--

### STATELESS COMPONENTS

-- {
    notes: |
        - most of your components should be stateless functions
        - in ideal wolrd
        - stateless components can follow a faster code path within the React core
        - recommended
        - why?
}

#### Stateless Components

```javascript
export let LookMaNoState = (props) => {
    return (<span>{props.name}</span>);
}
React.renderDom(<LookMaNoState name="Mark">, mountNode);
```

[fragment]
This is the recommended pattern, when possible.
[/fragment]

--

## [emphasize]Mutating State[/emphasize] is the root of all [emphasize]evil[/emphasize]

--

### What if I do need state?

[fragment]
##### Do I really?
[/fragment]

--

### Yes!

--

### Fine.

[fragment]
### Let's deal with state.
[/fragment]

-- {
    notes: |
        - e. g. loading indicator
        - keyword is internal
        - does not come from outside, usually
        - only leaves via specific api (callbacks)
}

### What does belong in my component's state?
- **internal** data
- that is changed by internal actions

-- {
    notes: |
        - Props in state is an anti-pattern
        - except for initilisation, like a counter
        - lists might also be an exception, but don't have to be
        - for performance
}

### What does **not** belong in my component's state?
- **external** data
- like Props (especially complex types)

-- {
    notes: |
        - how to communicate?
}

### When do I `setState()`?
- event handlers
- `componentWillReceiveProps`

--

## Props
[fragment]
- define a components API
- input and output
- **not** bindings
[/fragment]

--

### props stuff here

--

## Let's Talk About Context

-- {
    notes: |
        - they behave differently depending on where they're rendered
        - experimental api
}

### Don't use `context`[emphasize]*[/emphasize]

[fragment]
> "Using context makes your components more coupled and less reusable"

[/fragment]

--

### What is `context`?

[fragment]
- describes a components surroundings
- quasi globals (but safer[emphasize]*[/emphasize])
[/fragment]


--

### [emphasize]*[/emphasize]Use cases for context
[fragment]
- theming
- router(?)
[/fragment]

--

### Using context

```javascript
class MyWrapper extends React.Component {
    getChildContext() {
        return {
            mainColor: '#bada55'
        };
    }
}
```

--

### Using context

```javascript
class MyButton extends React.Component {
    render() {
        return (
            <button style={{backgroundColor: this.context.mainColor}}>
                {this.props.children}
            </button>
        );
    }
}
```

[fragment]
This won't work!
[/fragment]

[fragment]
```javascript
console.log(this.context);
// => {}
```
[/fragment]

-- {
    notes: |
        - notice the CHILD contextTypes
}

### Context is safe(ish)
```javascript
class MyWrapper extends React.Component {
    getChildContext() {
        return {
            mainColor: '#bada55'
        };
    }
}

MyWrapper.childContextTypes = {
    mainColor: React.PropTypes.string
};
```

--

### Context is safe(ish)

```javascript
class MyButton extends React.Component {
    render() {
        return (
            <button style={{backgroundColor: this.context.color}}>
                {this.props.children}
            </button>
        );
    }
}

MyButton.contextTypes = {
    mainColor: React.PropTypes.string
};
```

-- {
    notes: |
        - generally, don't
}

### [emphasize]*[/emphasize]Use cases for context
[fragment]
- theming
- navigator/router (maybe)
[/fragment]

--

### Quiz Time!

--

```javascript
class MyWrapper extends React.Component {
    getChildContext() {
        return this.state;
    }
    constructor(props) {
        super(props);
        UserSerivce.getUserByRoute(this.context.currentRoute)
            .then((user) => {
                this.setState({user});
            });
    }
    render() {
        return (<Profile />);
    }
}
```

[small]assume `contextTypes` are set correctly[/small]

-- {
    notes: |
        - assume context types are set
}


```javascript
class Profile extends React.Component {
    // ... addAsFriend()
    render() {
        return (
            <div className="user-profile">
                <h3>{this.context.user.name}</h3>
                <span>
                    {`Friends: ${this.context.user.friendCount}`}
                </span>
                <button onClick={this.addAsFriend.bind(this)}>
                    Add As Friend
                </button>
            </div>
        );
    }
}
```

--

```javascript
class Profile extends React.Component {
    addAsFriend() {
        this.context.user
                .addUser(this.context.currentUser);
    }
    // ... render()
}
```

--

### Problems?

[fragment]
How could this be improved?
[/fragment]

--

```javascript
class MyWrapper extends React.Component {
    constructor(props) {
        super(props);
    }
    // data retrieval with Flux
    render() {
        return (<Profile user={this.state.user} />);
    }
}
```

-- {
    notes: |
        - why is this better?
}

```javascript
class Profile extends React.Component {
    // ... addAsFriend()
    render() {
        return (
            <div className="user-profile">
                <h3>{this.props.user.name}</h3>
                <span>
                    {`Friends: ${this.props.user.friendCount}`}
                </span>
                <button onClick={this.addAsFriend.bind(this)}>
                    Add As Friend
                </button>
            </div>
        );
    }
}
```

[fragment]
`addAsFriend()` with Flux
[/fragment]
