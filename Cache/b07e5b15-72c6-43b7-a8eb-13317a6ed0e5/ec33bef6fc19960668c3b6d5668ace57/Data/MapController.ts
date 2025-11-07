// Corrections à apporter dans MapController.ts

// 1. Dans handleHoverUpdate - ligne ~720
handleHoverUpdate(localPosition: vec2): void {
  if (!this.isInitialized) {
    return;
  }
  if (this.isDraggingPin) {
    return;
  }
  localPosition = localPosition.uniformScale(0.5);
  
  // CORRECTION: Appliquer la transformation de rotation si nécessaire
  if (this.config.isMiniMap && this.mapParameters.isMinimapAutoRotate && !this.viewScrolled) {
    localPosition = this.getPositionWithMapRotationOffset(localPosition);
  }

  this.pinSet.forEach((pin: MapPin) => {
    const isHoveringPin =
      localPosition.distance(
        pin.screenTransform.anchors.getCenter()
      ) < this.mapParameters.mapPinCursorDetectorSize;
    if (isHoveringPin) {
      log.i("Pin hovered");
      if (!this.hoveringPinSet.has(pin)) {
        this.hoveringPinSet.add(pin);
        // Enable outline object
        pin.enableOutline(true);
      }
    } else if (this.hoveringPinSet.has(pin)) {
      log.i("Pin exit hover");

      this.hoveringPinSet.delete(pin);
      // Disable outline object
      pin.enableOutline(false);
    }
  });
}

// 2. Dans handleTouchStart - ligne ~750
handleTouchStart(localPosition: vec2): void {
  if (!this.isInitialized) {
    return;
  }
  if (this.hoveringPinSet.size > 0) {
    log.i(`handleTouchStart`);
    for (let value of this.hoveringPinSet.values()) {
      this.draggingPin = value;
      break;
    }
    this.isDraggingPin = true;
  } else {
    // CORRECTION: Laisser MapGridView gérer la transformation des coordonnées
    this.gridView.handleScrollStart(localPosition);
  }
}

// 3. Dans handleTouchUpdate - ligne ~770
handleTouchUpdate(localPosition: vec2): void {
  if (!this.isInitialized) {
    return;
  }
  if (this.isDraggingPin) {
    localPosition = localPosition.uniformScale(0.5);
    
    // CORRECTION: Appliquer la transformation de rotation pour le pin dragging
    if (this.config.isMiniMap && this.mapParameters.isMinimapAutoRotate && !this.viewScrolled) {
      localPosition = this.getPositionWithMapRotationOffset(localPosition);
    }
    
    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    this.pinOffsetter.unbindScreenTransform(this.draggingPin.screenTransform);
    this.draggingPin.screenTransform.anchors.setCenter(localPosition);
  } else {
    // CORRECTION: Laisser MapGridView gérer la transformation des coordonnées
    this.gridView.handleScrollUpdate(localPosition);
  }
}

// 4. Dans handleTouchEnd - ligne ~790
handleTouchEnd(localPosition: vec2): void {
  if (!this.isInitialized) {
    return;
  }
  if (this.isDraggingPin) {
    localPosition = localPosition.uniformScale(0.5);
    
    // CORRECTION: Appliquer la transformation de rotation pour le pin dragging
    if (this.config.isMiniMap && this.mapParameters.isMinimapAutoRotate && !this.viewScrolled) {
      localPosition = this.getPositionWithMapRotationOffset(localPosition);
    }
    
    log.i(`handleTouchEnd at: ${localPosition}`);

    this.setPinLocation(
      this.draggingPin,
      localPosition.uniformScale(0.5)
    );

    this.hoveringPinSet.add(this.draggingPin);
    this.draggingPin.sceneObject.getChild(0).enabled = true;

    this.draggingPin = null;
    this.isDraggingPin = false;
  } else {
    this.gridView.handleScrollEnd();
  }
}

// 5. Amélioration de la méthode getPositionWithMapRotationOffset - ligne ~1260
getPositionWithMapRotationOffset(localPosition: vec2): vec2 {
  // Si la carte n'est pas en rotation, retourner la position telle quelle
  if (!this.config.isMiniMap || !this.mapParameters.isMinimapAutoRotate) {
    return localPosition;
  }
  
  const angle = Math.atan2(localPosition.y, localPosition.x);
  const distance = Math.sqrt(
    localPosition.x * localPosition.x + localPosition.y * localPosition.y
  );
  
  // Obtenir la rotation actuelle de la grille
  const mapRotInRad = customGetEuler(
    this.config.gridScreenTransform.rotation
  ).z;
  
  // CORRECTION: Appliquer la rotation inverse pour compenser
  const adjustedRotationInRad = angle + mapRotInRad; // Rotation inverse
  
  const adjustedLocalPosition = new vec2(
    Math.cos(adjustedRotationInRad),
    Math.sin(adjustedRotationInRad)
  ).uniformScale(distance);
  
  return adjustedLocalPosition;
}