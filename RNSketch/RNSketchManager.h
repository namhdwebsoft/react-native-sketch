//
//  RNSketchManager.m
//  RNSketch
//
//  Created by Jeremy Grancher on 28/04/2016.
//  Copyright © 2016 Jeremy Grancher. All rights reserved.
//

#import <React/RCTViewManager.h>
#import "RNSketch.h"
  
@interface RNSketchManager : RCTViewManager

@property (nonatomic, strong) UIColor *strokeColor;
@property (nonatomic, assign) NSInteger strokeThickness;

@property (strong) RNSketch *sketchView;

@end;
