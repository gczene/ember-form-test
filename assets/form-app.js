/* jshint ignore:start */

/* jshint ignore:end */

define('form-app/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'form-app/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('form-app/components/bg-form', ['exports', 'ember', 'form-app/templates/components/bg-form'], function (exports, Ember, layout) {

  'use strict';

  var FormObject = Ember['default'].Object.extend({
    valid: (function () {
      return !this.get("_statuses").findBy("valid", false);
    }).property("_statuses.@each.valid"),
    invalid: Ember['default'].computed.not("valid")
  });

  exports['default'] = Ember['default'].Component.extend({

    layout: layout['default'],

    classNameBindings: ["form.invalid:bg-invalid", "form.valid:bg-valid"],

    init: function init() {
      this._super();
      this.set("form", FormObject.create({
        _statuses: Ember['default'].A([])
      }));
    },

    valid: Ember['default'].computed.readOnly("form.valid"),
    invalid: Ember['default'].computed.readOnly("form.invalid")

  });

});
define('form-app/components/bg-input', ['exports', 'ember', 'form-app/templates/components/bg-input'], function (exports, Ember, layout) {

  'use strict';

  var StatusObject = Ember['default'].Object.extend({
    valid: true,
    invalid: Ember['default'].computed.not("valid"),
    pristine: true,
    dirty: Ember['default'].computed.not("pristine"),
    touched: false,
    untouched: Ember['default'].computed.not("touched"),
    focused: false,
    blurred: Ember['default'].computed.not("focused"),
    pending: false });

  exports['default'] = Ember['default'].TextField.extend({

    layout: layout['default'],

    classNameBindings: ["status.invalid:bg-invalid", "status.valid:bg-valid", "status.pristine:bg-pristine", "status.dirty:bg-dirty", "status.touched:bg-touched", "status.untouched:bg-untouched", "status.pending:bg-pending", "status.focused:bg-focused", "status.blurred:bg-blurred"],

    init: function init() {

      var form;
      var component = this;

      this._super();

      // Set default value from model
      this.set("value", this.get("model"));

      // Create an empty status object
      this.set("status", StatusObject.create({
        name: this.get("name")
      }));

      if (this.get("name")) {

        // Retrieve the parent
        // bg-form component
        do {
          component = component.get("_parentView");
          form = component.get("form");
        } while (component && !form);

        // Store a reference
        // to the bg-form
        this.form = form;

        this.form.get("_statuses").pushObject(this.get("status"));
      }
    },

    didInsertElement: function didInsertElement() {
      var _this = this;

      this.$().blur(function () {
        _this.set("status.focused", false);
        _this.set("status.touched", true);
      });

      this.$().focus(function () {
        _this.set("status.focused", true);
      });
    },

    onBlurInput: function onBlurInput() {},

    onModelChange: (function () {
      if (this.get("model") !== this.get("value")) {
        this.set("value", this.get("model"));
      }
    }).observes("model"),

    onValueChange: (function () {
      if (this.get("model") !== this.get("value")) {
        this.set("status.pristine", false);
        if (!this.get("value")) {
          this.set("status.valid", false);
        } else {
          this.set("status.valid", true);
        }
        this.set("model", this.get("value"));
      }
    }).observes("value"),

    onNameChange: (function () {
      this.set("status.name", this.get("name"));
      this.form.set(this.get("name"), this.get("status"));
    }).observes("name").on("init")

  });

});
define('form-app/controllers/index', ['exports', 'ember', 'form-app/validations/userRules'], function (exports, Ember, validations) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    formModelHelper1: Ember['default'].inject.service("formModelHelper"),
    formModelHelper2: Ember['default'].inject.service("formModelHelper"),
    userSet: (function () {
      this.set("user1", this.get("formModelHelper").create({
        firstName: "Gabor",
        lastName: "Czene",
        validations: validations['default']
      }));
      this.set("user2", this.get("formModelHelper2").create({
        firstName: "Olivier",
        lastName: "",
        validations: {
          firstName: {
            presence: true,
            length: { minimum: 3 }
          },
          lastName: {
            presence: true
          }
        }
      }));

      // setTimeout(() => {
      //   console.log(this.get('user'));
      // }, 1000);
    }).on("init")
  });

});
define('form-app/initializers/app-version', ['exports', 'form-app/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('form-app/initializers/export-application-global', ['exports', 'ember', 'form-app/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('form-app/initializers/form-model-helper', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.register("service:form-model-helper", "formModelHelper", { singleton: false });
    application.inject("controller", "formModelHelper", "service:form-model-helper");
  }

  exports['default'] = {
    name: "form-model-helper",
    initialize: initialize
  };

});
define('form-app/router', ['exports', 'ember', 'form-app/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;

});
define('form-app/routes/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('form-app/services/form-model-helper', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

  'use strict';

  /**
   * Form model helper
   * this service based on ember-validation see https://github.com/dockyard/ember-validations
   * Example controller: <todo: URL of github example controller>
   *
   *  this service will generate a '$status' object on the passed obj.
   *  e.g. user: {firstName: 'John', lastName: 'Doe'}
   *  will have new properties like
   *  - $status.firstName.valid   => one property validity
   *  - errors.firstName          => see: ember-validations
   *  - $valid                    => indicates the whole object validity (if any of them is invalid, it becomes to false too)
   *
   */

  var statusObjectPrefix = "$status";

  exports['default'] = Ember['default'].Object.extend(EmberValidations['default'].Mixin, {
    /**
     * Observer for form properties
     */
    _addObserver: function _addObserver() {
      this.setValidationByErrors();
    },
    /**
     * Over ride status prefix.
     * this status object contains the validity flags of properties
     * for example this.get('$status.firstName.valid');
     * default is '$status'
     * call it before 'create' method!
     * @param {[type]} a [description]
     */
    setStatusPrefix: function setStatusPrefix(newPrefix) {
      statusObjectPrefix = newPrefix || statusObjectPrefix;
      return this;
    },
    /**
     * Setting validity flags depends on ember-validation.errors
     */
    setValidationByErrors: function setValidationByErrors() {
      var _this = this;

      this.set("$valid", true);
      return this.validate()["catch"](function (err) {
        // one of them fails => the form is invalid
        _this.set("$valid", false);
      })["finally"](function () {
        // looping through the passed validation rules and compare it to ember-validations.errors
        // and sets up true | false on the
        Ember['default'].keys(_this.get("validations")).forEach(function (key) {
          _this.setOnePropertyValidity(key, !_this.get("errors." + key).get("length"));
        });
      });
    },
    /**
     * Set up one form property flag
     * @param {String}  prop   property name
     * @param {Boolean} value  value to set
     * @return {this}
     */
    setOnePropertyValidity: function setOnePropertyValidity(prop, value) {
      this.set(statusObjectPrefix + "." + prop + ".valid", value);
      return this;
    },
    /**
     * part of initialization
     * based on the passed form properties sets up status object
     * @param {String}  prop    property name
     * @return {Object} this
     */
    setDefaultStatusObject: function setDefaultStatusObject(prop) {
      this.set(statusObjectPrefix + "." + prop, {});
      return this;
    },
    /**
     * Creating an instance and sets up initial values
     * validation fired
     * @param  {Object}   props  propertes' key, value + validations
     * @return {Object}           this
     */
    create: function create(props) {
      var _this = this;

      this.set(statusObjectPrefix, {});
      Ember['default'].keys(props).forEach(function (prop) {
        if (prop !== "validations") {
          _this.set(prop, props[prop]).setDefaultStatusObject(prop).setOnePropertyValidity(prop, true).addObserver(prop, _this, "_addObserver");
        }
      });

      if (props.validations) {
        this.set("validations", props.validations);
        this.init();
        this.setValidationByErrors();
      }
      return this;
    }
  });

});
define('form-app/services/validations', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Object.extend({
    init: function init() {
      set(this, "cache", {});
    }
  });

});
define('form-app/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1,"id","title");
        var el2 = dom.createTextNode("Welcome to Ember.js");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,1,2,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('form-app/templates/components/bg-form', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        inline(env, morph0, context, "yield", [get(env, context, "form")], {});
        return fragment;
      }
    };
  }()));

});
define('form-app/templates/components/bg-input', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('form-app/templates/components/ember-form', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('form-app/templates/components/my-comp', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('form-app/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Both input has initial value");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("hr");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1,"border","1");
        dom.setAttribute(el1,"cellpadding","10");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tr");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("td");
        var el4 = dom.createTextNode("\n    User1:\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("pre");
        var el5 = dom.createTextNode("\n{\n  firstName: 'Gabor',\n  lastName: 'Czene'\n}\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\nValidation:\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("pre");
        var el5 = dom.createTextNode("\n{\n  firstName: {\n    presence: true\n  },\n  lastName: {\n    presence: true\n  }\n}\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("td");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Form");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\nStatuses:");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("user1.$status.firstName.valid");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("user1.$status.lastName.valid");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("user1.$valid");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(":\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("LastName is missing at page load");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("hr");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1,"border","1");
        dom.setAttribute(el1,"cellpadding","10");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tr");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("td");
        var el4 = dom.createTextNode("\n    User2:\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("pre");
        var el5 = dom.createTextNode("\n{\n  firstName: 'Olivier',\n  lastName: ''\n}\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\nValidation:\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("pre");
        var el5 = dom.createTextNode("\n{\n  firstName: {\n    presence: true,\n    length: {minimum: 3}\n  },\n  lastName: {\n    presence: true\n  }\n}\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("td");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Form");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\nStatuses:");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("user2.$status.firstName.valid");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("user2.$status.lastName.valid");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("hr");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("user2.$valid");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(":\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [4, 1, 3]);
        var element1 = dom.childAt(fragment, [10, 1, 3]);
        var morph0 = dom.createMorphAt(element0,2,3);
        var morph1 = dom.createMorphAt(element0,3,4);
        var morph2 = dom.createMorphAt(element0,10,11);
        var morph3 = dom.createMorphAt(element0,15,16);
        var morph4 = dom.createMorphAt(element0,20,21);
        var morph5 = dom.createMorphAt(element1,2,3);
        var morph6 = dom.createMorphAt(element1,3,4);
        var morph7 = dom.createMorphAt(element1,10,11);
        var morph8 = dom.createMorphAt(element1,15,16);
        var morph9 = dom.createMorphAt(element1,20,21);
        inline(env, morph0, context, "input", [], {"value": get(env, context, "user1.firstName")});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "user1.lastName")});
        content(env, morph2, context, "user1.$status.firstName.valid");
        content(env, morph3, context, "user1.$status.lastName.valid");
        content(env, morph4, context, "user1.$valid");
        inline(env, morph5, context, "input", [], {"value": get(env, context, "user2.firstName")});
        inline(env, morph6, context, "input", [], {"value": get(env, context, "user2.lastName")});
        content(env, morph7, context, "user2.$status.firstName.valid");
        content(env, morph8, context, "user2.$status.lastName.valid");
        content(env, morph9, context, "user2.$valid");
        return fragment;
      }
    };
  }()));

});
define('form-app/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('form-app/tests/components/bg-form.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/bg-form.js should pass jshint', function() { 
    ok(false, 'components/bg-form.js should pass jshint.\ncomponents/bg-form.js: line 9, col 3, Missing semicolon.\n\n1 error'); 
  });

});
define('form-app/tests/components/bg-input.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/bg-input.js should pass jshint', function() { 
    ok(false, 'components/bg-input.js should pass jshint.\ncomponents/bg-input.js: line 54, col 35, Missing semicolon.\n\n1 error'); 
  });

});
define('form-app/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('form-app/tests/helpers/resolver', ['exports', 'ember/resolver', 'form-app/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('form-app/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('form-app/tests/helpers/start-app', ['exports', 'ember', 'form-app/app', 'form-app/router', 'form-app/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('form-app/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('form-app/tests/initializers/form-model-helper.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/form-model-helper.js should pass jshint', function() { 
    ok(true, 'initializers/form-model-helper.js should pass jshint.'); 
  });

});
define('form-app/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('form-app/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('form-app/tests/services/form-model-helper.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/form-model-helper.js should pass jshint', function() { 
    ok(false, 'services/form-model-helper.js should pass jshint.\nservices/form-model-helper.js: line 45, col 15, \'err\' is defined but never used.\n\n1 error'); 
  });

});
define('form-app/tests/test-helper', ['form-app/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('form-app/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/components/bg-form-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("bg-form", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });

  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('form-app/tests/unit/components/bg-form-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/bg-form-test.js should pass jshint', function() { 
    ok(true, 'unit/components/bg-form-test.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/components/bg-input-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("bg-input", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });

  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('form-app/tests/unit/components/bg-input-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/bg-input-test.js should pass jshint', function() { 
    ok(true, 'unit/components/bg-input-test.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/components/ember-form-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("ember-form", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });

  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('form-app/tests/unit/components/ember-form-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/ember-form-test.js should pass jshint', function() { 
    ok(true, 'unit/components/ember-form-test.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/components/my-comp-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("my-comp", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });

  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('form-app/tests/unit/components/my-comp-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/my-comp-test.js should pass jshint', function() { 
    ok(true, 'unit/components/my-comp-test.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/controllers/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:index", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('form-app/tests/unit/controllers/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/index-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/index-test.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/initializers/form-model-helper-test', ['ember', 'form-app/initializers/form-model-helper', 'qunit'], function (Ember, form_model_helper, qunit) {

  'use strict';

  var container, application;

  qunit.module("FormModelHelperInitializer", {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        container = application.__container__;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test("it works", function (assert) {
    form_model_helper.initialize(container, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('form-app/tests/unit/initializers/form-model-helper-test.jshint', function () {

  'use strict';

  module('JSHint - unit/initializers');
  test('unit/initializers/form-model-helper-test.js should pass jshint', function() { 
    ok(true, 'unit/initializers/form-model-helper-test.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:index", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('form-app/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
define('form-app/tests/unit/services/form-model-helper-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("service:form-model-helper", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  // Specify the other units that are required for this test.
  // needs: ['service:foo']

});
define('form-app/tests/unit/services/form-model-helper-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/form-model-helper-test.js should pass jshint', function() { 
    ok(true, 'unit/services/form-model-helper-test.js should pass jshint.'); 
  });

});
define('form-app/tests/validations/userRules.jshint', function () {

  'use strict';

  module('JSHint - validations');
  test('validations/userRules.js should pass jshint', function() { 
    ok(true, 'validations/userRules.js should pass jshint.'); 
  });

});
define('form-app/validations/userRules', ['exports'], function (exports) {

  'use strict';

  exports['default'] = {
    firstName: {
      presence: true
    },
    lastName: {
      presence: true
    }
  };

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('form-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'form-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("form-app/tests/test-helper");
} else {
  require("form-app/app")["default"].create({"LOG_ACTIVE_GENERATION":false,"LOG_VIEW_LOOKUPS":false,"name":"form-app","version":"0.0.0.863053c1"});
}

/* jshint ignore:end */
//# sourceMappingURL=form-app.map