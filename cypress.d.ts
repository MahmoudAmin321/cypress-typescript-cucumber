// Indicate, this .ts file is a module to avoid error [Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.ts(2669)]
export {};

// Reference: https://docs.cypress.io/guides/tooling/typescript-support#Using-an-External-Typings-File
declare global {
  namespace Cypress {
    interface Chainable {
      //   /**
      //    * Custom command to select DOM element by data-cy attribute.
      //    * @example cy.dataCy('greeting')
      //    */
      //   dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      //   login(email: string, password: string): Chainable<void>;
      //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
      //   dismiss(
      //     subject: string,
      //     options?: Partial<TypeOptions>
      //   ): Chainable<Element>;
      //   visit(
      //     originalFn: CommandOriginalFn,
      //     url: string,
      //     options: Partial<VisitOptions>
      //   ): Chainable<Element>;
    }
  }
}
