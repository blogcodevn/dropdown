import { cloneElement, ForwardRefExoticComponent, ReactElement, RefAttributes } from "react";

export type ComponentWithRef<Element, Props = {}> = ForwardRefExoticComponent<
RefAttributes<Element> & Props & { children: React.ReactNode }
>;

const getComponent = <T,>(
  CustomComponent: ComponentWithRef<T, any> | undefined,
  DefaultComponent: ComponentWithRef<T>,
  props: React.PropsWithChildren<{}>,
  ref: React.Ref<T>
): ReactElement => {
  if (CustomComponent) {
    const isForwardRefComponent = !!CustomComponent.$$typeof;
    if (!isForwardRefComponent) {
      throw new Error(`${CustomComponent.displayName || 'CustomComponent'} must accept ref`);
    }
    return cloneElement(<CustomComponent {...props}>{props.children}</CustomComponent>, { ref });
  } else {
    return <DefaultComponent ref={ref} {...props}>{props.children}</DefaultComponent>;
  }
};

export default getComponent;
