class NewProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      engineers: []
    };
  }

  componentDidMount() {
    this.getEngineersFromDatabase();

  }

  componentDidUpdate() {
    let contributors = $('input[name=contributors]');
    let options = this.state.engineers.map( engineer => {
       return {gitHandle: engineer.gitHandle, name: engineer.name}
    })
    $.each(contributors, function(i, contributor) {  //i=index, item=element in array
      console.log('options: ', options)
      $(contributor).selectize({
          persist: false,
          maxItems: null,
          valueField: 'gitHandle',
          labelField: 'name',
          searchField: ['gitHandle', 'name'],
          options: options
          // options: [
              // {email: 'brian@thirdroute.com', name: 'Brian Reavis'},
              // {email: 'nikola@tesla.com', name: 'Nikola Tesla'},
          // ],
          // render: {
          //     item: function(item, escape) {
          //         return '<div>' +
          //             (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
          //             (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
          //         '</div>';
          //     },
          //     option: function(item, escape) {
          //         var label = item.name || item.email;
          //         var caption = item.name ? item.email : null;
          //         return '<div>' +
          //             '<span class="label">' + escape(label) + '</span>' +
          //             (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
          //         '</div>';
          //     }
          // },
          // createFilter: function(input) {
          //     var match, regex;

          //     // email@address.com
          //     regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
          //     match = input.match(regex);
          //     if (match) return !this.options.hasOwnProperty(match[0]);

          //     // name <email@address.com>
          //     regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
          //     match = input.match(regex);
          //     if (match) return !this.options.hasOwnProperty(match[2]);

          //     return false;
          // },
          // create: function(input) {
          //     if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
          //         return {email: input};
          //     }
          //     var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
          //     if (match) {
          //         return {
          //             email : match[2],
          //             name  : $.trim(match[1])
          //         };
          //     }
          //     alert('Invalid email address.');
          //     return false;
          // }
      });    
    });
    // var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                      // '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
  }

  getEngineersFromDatabase() {
    console.log('getEngineers function called');
    getEngineer( 'all', engineers => {
      this.setState({
        engineers: JSON.parse(engineers),
        filteredEngineers: JSON.parse(engineers)
      });
    });
  }

  submitForm(e) {
    let data = {
      title: $('#projectTitle-form').val(),
      engineers: [],
      technologies: $('#technologies-form').val(),
      description: $('#projectDescription-form').val(),
      image: $('#image-form').val()
    };

    //retrieve all contributors if multiple fields
    let contributors = $('input[name=contributors]');
    $.each(contributors, function(i, contributor) {  //i=index, item=element in array
      data.engineers.push($(contributor).val());
    });

    console.log('from newProject component: ', data)

    // postProject(data);
  }

  renderSuggestions() {
    return (
      <datalist id="suggestions">
        {
          this.state.engineers.map( engineer =>
            <option value={engineer.name} />
          )
        }
      </datalist>
    )
  }

 







  render() {
    return (
      <div className="actual-content">
        <div id="form-input">
          <form className="form" id="form1">
            <p className="projectTitle">
              <input name="projectTitle" type="text" className="formInput" placeholder="Project Title" id="projectTitle-form" />
            </p>
            <p className="contributors">
              <input name="contributors" type="list" className="formInput" id="contributors-form" placeholder="Contributors" list="suggestions"/>
              {this.renderSuggestions()}
            </p>

            <p className="technologies">
              <input name="technologies" type="text" className="formInput" id="technologies-form" placeholder="Technologies" />
            </p>

            <p className="image">
              <input name="image" type="text" className="formInput" id="image-form" placeholder="Image" />
            </p>

            <p className="projectDescription">
              <textarea name="projectDescription" className="formInput" id="projectDescription-form" placeholder="Project Description"></textarea>
            </p>
          </form>
          <div className="submit">
            <input type="button" value="SUBMIT" onClick={this.clickHandler} onClick={this.props.buttonClick} id="button-blue"/>
          </div>
        </div>
      </div>
    );
  }
}

// export default App
window.NewProject = NewProject;
