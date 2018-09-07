# rc-http

AngularJS Component for request $http or other service. 


Basic usage
---------------
Install bower package:
```bash
bower install rc-http --save
```

```javascript
angular('yourAngularApp',['rcHttp']);
```

<h4>Parameters</h4>

- **rc-http** = Component.
- **service** = Service name, optional default: $http.
- **method** = Method name from the service, optional default: get.
- **url** = Url to make request, optional.
- **params** = Optional for $http is config.params.
- **model** = Optional for $http is config.data.
- **config** = Optional for $http is config.
- **template-url** = Url template. Optional
- **onStart** = Expression on request start.
- **onSuccess** = Expression on request success. $success
- **onError** = Expression on request error. $error
  Access in your template with "$rcHttp".


<h4>Usage/Example</h4>

```html
<rc-http url="http://demo.wp-api.org/wp-json/wp/v2/posts/1" ng-bind-html="$rcHttp.data.content.rendered"></rc-http>

<rc-http url="http://demo.wp-api.org/wp-json/wp/v2/posts/1">
    <section ng-bind-html="$rcHttp.data.content.rendered"></section>
</rc-http>
```

```html

