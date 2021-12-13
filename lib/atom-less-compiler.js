import ModalPanelView from './modal-panel-view';
import { CCCLessCompiler } from '../node_modules/ccc-less-compiler/ccc-less-compiler.js';

class AtomLessCompiler extends CCCLessCompiler {

  constructor( state, less_input_path, settings = {
    less_file_extension:                 'lessFileExtension',
    css_file_extension:                  'cssFileExtension',
    sourcemap_file_extension:            'sourcemapFileExtension',
    success_display_time:                'successDisplayTime',
    no_output_display_time:              'noOutputDisplayTime',
    should_compress:                     'shouldCompressCSS',
    should_notify_success:               'shouldNotifySuccess',
    should_use_input_root_directory:     'shouldUseInputRootDirectory',
    less_input_directory_relative_paths: 'inputRootDirectoryPaths',
    should_use_system_root:              'shouldInterpretRootAsSystemRoot',
    css_output_directory_path:           'outputPath',
    should_create_sourcemap:             'shouldCreateSourcemap',
    should_inline_sourcemap:             'shouldInlineSourcemap',
    should_create_file_for_empty_output: 'shouldCreateFileForEmptyOutput'
  } ) {
    super( state, less_input_path, settings );
    this.initModalView( state );

  }

  loadConfigSettings( settings ) {
    this.settings = {};
    let setting_keys = Object.keys(settings);
    for ( let this_setting_key of setting_keys ) {
      let this_atom_config_key = 'atom-compile-less.'
                               + settings[ this_setting_key ];
      this.settings[ this_setting_key ] = atom.config.get( this_atom_config_key );
    }
  }

  initModalView( state ) {
    this.modal_panel_view = new ModalPanelView(
                              state.ModalPanelViewState,
                              this.less_input_path,
                              this.css_output_path
                            );

    this.modal_panel = atom.workspace.addModalPanel({
      item:    this.modal_panel_view.getElement(),
      visible: false
    });
  }

  // Find the folder included in project that is root for this editor.
  // Ex: open /path/to/source_directory in project,
  //     editing source_directory/nested/path/to/some_class.js
  //     We want /path/to/source_directory.
  projectRootPath() {
    let current_path = atom.workspace.getActiveTextEditor().getPath();
    let project_directories = atom.project.getPaths();
    let project_root_path = null;
    for ( this_path of project_directories ) {
      if ( current_path.startsWith( this_path ) ){
        project_root_path = this_path;
        break;
      }
    }

    return project_root_path;
  }

  destroy() {
    this.modalPanel.destroy();
    this.ModalPanelView.destroy();
  }

  compile() {
    this.loadConfigSettings(); // Run again in case settings changed.
    let current_path = atom.workspace.getActiveTextEditor().getPath();
    super.compile( current_path );
  }

  handleFileError( error, less_input ) {
    atom.notifications.addError(
      error,
      {
        dismissable: true
      }
    );
  }

  notifySuccess() {
    this.modal_panel_view.setSuccess();
    this.showPanel( this.settings.success_display_time );
  }

  notifyNoOutput() {
    this.modal_panel_view.setNoOutput();
    this.showPanel( this.settings.no_output_display_time );
  }

  notifyError( error ) {
    atom.notifications.addError(
      error,
      {
        dismissable: true
      }
    );
  }

  showPanel( display_time ) {
    this.modal_panel.show();
    let modal_panel = this.modal_panel;
    setTimeout( () => { modal_panel.hide(); }, display_time );
  }

}

export default AtomLessCompiler;
