'use babel';

import AtomLessCompiler from './atom-less-compiler.js';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  self: this,

  config: {
    shouldCompressCSS: {
      title: 'Compress CSS Output',
      type: 'boolean',
      default: true
    },
    shouldNotifySuccess: {
      title: 'Display Success Notification',
      type: 'boolean',
      default: true
    },
    shouldUseInputRootDirectory: {
      title: 'Use Root Directory for Input Files',
      description: 'If enabled, will use root directory path as nested path under output directory.',
      type: 'boolean',
      default: false
    },
    inputRootDirectoryPaths: {
      title: 'Less Input Root Directory Paths',
      description: 'Relative path from project directories or from .less file. Multiple specifications permitted, use [ item, ... ] format.',
      type: 'array',
      default: [ ],
      items: {
        type: 'string',
        default: ''
      }
    },
    outputPath: {
      title: 'CSS Output File Directory Path',
      description: 'Absolute path from project directories; relative path from .less file.',
      type: 'string',
      default: './'
    },
    shouldInterpretRootAsSystemRoot: {
      title: 'Interpret Root Directory as System Root',
      description: 'Instead of Project Virtual Root (Directory Collection).',
      type: 'boolean',
      default: false
    },
    lessFileExtension: {
      title: 'Less Input File Extension',
      type: 'string',
      default: '.less'
    },
    cssFileExtension: {
      title: 'CSS Output File Extension',
      type: 'string',
      default: '.css'
    },
    shouldCreateFileForEmptyOutput: {
      title: 'Create File for Empty Output',
      type: 'boolean',
      default: false
    },
    shouldCreateSourcemap: {
      title: 'Create Sourcemap',
      type: 'boolean',
      default: true
    },
    shouldInlineSourcemap: {
      title: 'Inline Sourcemap',
      type: 'boolean',
      default: true
    },
    sourcemapFileExtension: {
      title: 'Source Map File Extension',
      description: 'For out-of-line maps.',
      type: 'string',
      default: '.less.sourcemap'
    },
    successDisplayTime: {
      title: 'Time to Display Success Panel',
      description: 'in ms',
      type: 'integer',
      default: 500,
      minimum: 1
    },
    noOutputDisplayTime: {
      title: 'Time to Display No Output Panel',
      description: 'in ms',
      type: 'integer',
      default: 500,
      minimum: 1
    }
  },

  activate( state ) {

    input_path = atom.workspace.getActiveTextEditor().getPath();
    self.compiler = new AtomLessCompiler( state, input_path );

    self.subscription = atom.commands.add( 'atom-workspace', {
      'atom-compile-less:compile': this.compile
    } );

    self.subscriptions = new CompositeDisposable();
    self.subscriptions.add( self.subscription );
  },

  deactivate() {
    self.subscriptions.dispose();
    self.compiler.destroy();
  },

  serialize() {
  },

  compile() {
    let current_editor = atom.workspace.getActiveTextEditor();
    current_editor.save();
    current_editor.onDidSave( () => self.compiler.compile() );
  }

};
