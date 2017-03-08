//
//  RNSketch.h
//  RNSketch
//
//  Created by Jeremy Grancher on 28/04/2016.
//  Copyright © 2016 Jeremy Grancher. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UIView+React.h"

@interface RNSketch : UIView

- (void)setStrokeColor:(UIColor *)strokeColor;
- (void)clearDrawing;
- (void)setImage:(NSString *)image;
- (NSString *)base64Code;

// Events
@property (nonatomic, copy) RCTBubblingEventBlock onReset;
@property (nonatomic, copy) RCTBubblingEventBlock onChange;

// Properties
@property (nonatomic, strong) UIColor *strokeColor;
@property (nonatomic, assign) NSInteger strokeThickness;
@property (nonatomic, assign) BOOL clearButtonHidden;
@property (nonatomic, strong) NSString *imageType;

@end
