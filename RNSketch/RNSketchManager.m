//
//  RNSketchManager.m
//  RNSketch
//
//  Created by Jeremy Grancher on 28/04/2016.
//  Copyright © 2016 Jeremy Grancher. All rights reserved.
//

#import "RNSketchManager.h"
#import "RNSketch.h"
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

#define ERROR_IMAGE_INVALID @"ERROR_IMAGE_INVALID"
#define ERROR_FILE_CREATION @"ERROR_FILE_CREATION"

@implementation RNSketchManager

RCT_EXPORT_MODULE()

#pragma mark - Events

RCT_EXPORT_VIEW_PROPERTY(onReset, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock);

RCT_CUSTOM_VIEW_PROPERTY(strokeColor, UIColor, RNSketch)
{
  [view setStrokeColor:json ? [RCTConvert UIColor:json] : [UIColor blackColor]];
}
  
#pragma mark - Properties


RCT_EXPORT_VIEW_PROPERTY(clearButtonHidden, BOOL);
RCT_EXPORT_VIEW_PROPERTY(strokeThickness, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(imageType, NSString);

#pragma mark - Lifecycle

- (instancetype)init
{
  if ((self = [super init])) {
    self.sketchView = nil;
  }
  
  return self;
}

- (UIView *)view
{
  if (!self.sketchView) {
    self.sketchView = [[RNSketch alloc] initWithFrame:CGRectZero];
  }
  
  return self.sketchView;
}


#pragma mark - Exported methods

RCT_EXPORT_METHOD(saveImage:(NSString *)encodedImage
                  ofType:(NSString *)imageType
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  // Strip the Base 64 Code out if it's there.
  NSString *base64Code = [self.sketchView base64Code];
  encodedImage = [encodedImage stringByReplacingOccurrencesOfString:base64Code
                                                         withString:@""
                                                            options:NULL
                                                              range:NSMakeRange(0, [base64Code length])];
  
  // Create image data with base64 source
  NSData *imageData = [[NSData alloc] initWithBase64EncodedString:encodedImage options:NSDataBase64DecodingIgnoreUnknownCharacters];
  if (!imageData) {
    return reject(ERROR_IMAGE_INVALID, @"You need to provide a valid base64 encoded image.", nil);
  }

  // Create full path of image
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths firstObject];
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *fullPath = [[documentsDirectory stringByAppendingPathComponent:[[NSUUID UUID] UUIDString]] stringByAppendingPathExtension:imageType];

  // Save image and return the path
  BOOL fileCreated = [fileManager createFileAtPath:fullPath contents:imageData attributes:nil];
  if (!fileCreated) {
    return reject(ERROR_FILE_CREATION, @"An error occured. Impossible to save the file.", nil);
  }
  resolve(@{@"path": fullPath});
}

RCT_EXPORT_METHOD(clear)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.sketchView clearDrawing];
  });
}

//export set method properly you way to high man look at you go you fucking baller of a man thats so cool of you god you are so good at what you do cuz look at how cool you can type even correcting errros around here too intentionally left that spelled wrong as if i didnt see that thing that i forgot god you are dumb awwww dab dab dab double dab look at that dab dab dabdab adb adb dab do it dab it alll up dab dab dab that that dab dab this that and this dab dab dab dab dab you good man look at you socializing and shit like you sposed too wow am i hgigh in the sky which I have no control over my ass oh no what will they think of me annnnn what is going on look at that guy his name is ryan he from hiawaii he gets high asf asf he good at what he do and be done lets go come on we are god woa didnt mean to sau that you jerk wont even fix that typos 
RCT_EXPORT_METHOD(setImage:(NSString *)image)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.sketchView setImage:image];
  });
}

@end
