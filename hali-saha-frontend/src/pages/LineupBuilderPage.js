import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import html2canvas from 'html2canvas';

const ItemTypes = {
  PLAYER: 'player',
};

// Player Edit Modal Component
const PlayerEditModal = ({ player, onSave, onCancel }) => {
  const [editName, setEditName] = useState(player ? player.name : '');
  const [editNumber, setEditNumber] = useState(player ? player.number : '');

  useEffect(() => {
    if (player) {
      setEditName(player.name || ''); // Ensure name is not undefined
      setEditNumber(player.number);
    }
  }, [player]);

  if (!player) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(player.id, editName, parseInt(editNumber, 10));
  };

  return (
    <div style={{
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '20px', borderRadius: '8px', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)', minWidth: '300px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Edit Player</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="playerName" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Name:</label>
            <input 
              type="text" 
              id="playerName" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="playerNumber" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Number:</label>
            <input 
              type="number" 
              id="playerNumber" 
              value={editNumber} 
              onChange={(e) => setEditNumber(e.target.value)} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              min="1" 
              max="99"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onCancel} style={{
              padding: '8px 15px', marginRight: '10px', background: '#eee', 
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}>Cancel</button>
            <button type="submit" style={{
              padding: '8px 15px', background: '#4CAF50', color: 'white', 
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Basic Draggable Player Icon Component
const PlayerIcon = ({ id, number, name, left, top, jerseyColor, numberColor, nameColor, onMove, onEdit, fieldRect }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.PLAYER,
    hover(item, monitor) {
      // This is a basic drop target for the field itself if needed, 
      // but individual player slots might be better drop targets.
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { id, left, top, type: ItemTypes.PLAYER }, // Initial position in %
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset(); // Pixels
      if (delta && item && fieldRect && fieldRect.width > 0 && fieldRect.height > 0) {
        const deltaXPercent = (delta.x / fieldRect.width) * 100;
        const deltaYPercent = (delta.y / fieldRect.height) * 100;

        let newLeftPercent = item.left + deltaXPercent;
        let newTopPercent = item.top + deltaYPercent;

        // Jersey icon dimensions (width is still 60px, height is now ~60px for jersey part)
        const iconWidthPx = 60;
        const jerseyHeightPx = 60; // Adjusted height for the jersey part only
        const iconWidthPercent = (iconWidthPx / fieldRect.width) * 100;
        const jerseyHeightPercent = (jerseyHeightPx / fieldRect.height) * 100;

        // Clamp position to keep icon within field boundaries
        newLeftPercent = Math.max(0, Math.min(newLeftPercent, 100 - iconWidthPercent));
        newTopPercent = Math.max(0, Math.min(newTopPercent, 100 - jerseyHeightPercent));

        onMove(item.id, newLeftPercent, newTopPercent);
      }
    }
  }), [id, left, top, onMove]);

  drag(drop(ref));

  console.log('PlayerIcon rendering with nameColor:', nameColor, 'for player:', name);

  return (
    <div // Outer container for positioning icon + name label
      ref={ref} // Drag handle on the whole unit
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        width: '60px', // Width of the jersey part
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
      }}
      onClick={() => onEdit(id)} // Click on whole unit to edit
    >
      {/* Jersey Part */}
      <div
        style={{
          width: '60px',
          height: '60px', // Reduced height for jersey
          backgroundColor: jerseyColor,
          color: numberColor, // Use numberColor for the number
          border: `2px solid ${secondaryColorFromMain(jerseyColor)}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        className="player-jersey"
      >
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{number}</div>
      </div>

      {/* Name Label Part */}
      <div 
        style={{
          width: '100%', // Match jersey width or slightly wider if needed
          marginTop: '4px', // Space between jersey and name
          color: nameColor, // Use nameColor for the player name label
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          whiteSpace: 'normal', // Allow name to wrap if very long
          wordBreak: 'break-word',
          lineHeight: '1.2',
        }}
        className="player-name-label"
      >
        {name || `Player ${number}`}
      </div>
    </div>
  );
};

// Helper to get a contrasting secondary color for border (simplified)
const secondaryColorFromMain = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Simple brightness check for black or white contrast
  return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#333333' : '#FFFFFF';
};

const LineupBuilderPage = () => {
  const [lineupName, setLineupName] = useState('My Awesome Lineup');
  const [fieldType, setFieldType] = useState('striped-green');
  const [formation, setFormation] = useState('4-4-2');
  const [playerCount, setPlayerCount] = useState(11);
  const [mainJerseyColor, setMainJerseyColor] = useState('#FF0000'); // Red
  const [secondaryJerseyColor, setSecondaryJerseyColor] = useState('#FFFFFF'); // White for accents if needed, not directly used by PlayerIcon currently
  const [jerseyNumberColor, setJerseyNumberColor] = useState('#FFFFFF'); // Color for the number on the jersey
  const [playerNameColor, setPlayerNameColor] = useState('#333333'); // Color for the name label below jersey
  const [fieldRect, setFieldRect] = useState({ width: 0, height: 0 });

  const formationTemplatesPercentage = {
    '4-4-2': [
      // Positions based on a 300x420 reference field, converted to percentage.
      // Player icon is 60px wide, 80px tall. Target is icon's top-left corner.
      // Calculations aim to center the icon around target points from screenshot.
      // Example: GK target center (150, 385) -> left% = ((150-30)/300)*100 = 40%, top% = ((385-40)/420)*100 = ~82.14%
      { id: 'p1', number: 1, name: 'GK', pos: { left: ((150-30)/300)*100, top: ((385-40)/420)*100 } }, // GK
      { id: 'p2', number: 2, name: '', pos: { left: ((50-30)/300)*100, top: ((300-40)/420)*100 } },  // LB
      { id: 'p3', number: 3, name: '', pos: { left: ((125-30)/300)*100, top: ((310-40)/420)*100 } }, // LCB
      { id: 'p4', number: 4, name: '', pos: { left: ((175-30)/300)*100, top: ((310-40)/420)*100 } }, // RCB
      { id: 'p5', number: 5, name: '', pos: { left: ((250-30)/300)*100, top: ((300-40)/420)*100 } }, // RB
      { id: 'p6', number: 6, name: '', pos: { left: ((50-30)/300)*100, top: ((180-40)/420)*100 } },  // LM
      { id: 'p7', number: 7, name: '', pos: { left: ((125-30)/300)*100, top: ((190-40)/420)*100 } }, // LCM
      { id: 'p8', number: 8, name: '', pos: { left: ((175-30)/300)*100, top: ((190-40)/420)*100 } }, // RCM
      { id: 'p9', number: 9, name: '', pos: { left: ((250-30)/300)*100, top: ((180-40)/420)*100 } }, // RM
      { id: 'p10', number: 10, name: '', pos: { left: ((125-30)/300)*100, top: ((80-40)/420)*100 } }, // LF
      { id: 'p11', number: 11, name: '', pos: { left: ((175-30)/300)*100, top: ((80-40)/420)*100 } }, // RF
    ],
    // Add other formations here with percentage positions
  };

  const initialPlayerPositions = formationTemplatesPercentage; // Alias for less refactoring below

  const [players, setPlayers] = useState(initialPlayerPositions[formation] || []);
  const fieldRef = useRef(null);
  const [editingPlayer, setEditingPlayer] = useState(null); // Stores the player object being edited

  useEffect(() => {
    if (fieldRef.current) {
      const rect = fieldRef.current.getBoundingClientRect();
      setFieldRect({ width: rect.width, height: rect.height });

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setFieldRect({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
      });
      resizeObserver.observe(fieldRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  useEffect(() => {
    // Update players when formation or player count changes
    let basePlayers = initialPlayerPositions[formation] || [];
    if (basePlayers.length > playerCount) {
      setPlayers(basePlayers.slice(0, playerCount));
    } else if (basePlayers.length < playerCount) {
      const additionalPlayers = Array.from({ length: playerCount - basePlayers.length }, (_, i) => ({
        id: `p${basePlayers.length + i + 1}`,
        number: basePlayers.length + i + 1,
        name: '',
        pos: { left: 10 + (i * 15) % 70, top: 85 } // Basic percentage positioning for extras at bottom of field
      }));
      setPlayers([...basePlayers, ...additionalPlayers]);
    } else {
      setPlayers(basePlayers);
    }
  }, [formation, playerCount]);

  const fieldStyles = {
    'striped-green': { fieldClass: 'bg-green-600 field-stripes', markingsColor: 'rgba(255,255,255,0.6)' },
    'plain-green': { fieldClass: 'bg-green-500', markingsColor: 'rgba(255,255,255,0.7)' },
    'dark-green': { fieldClass: 'bg-green-700', markingsColor: 'rgba(255,255,255,0.5)' },
  };

  const currentFieldStyle = fieldStyles[fieldType];

  const handleDownloadImage = async () => {
    if (fieldRef.current) {
      try {
        const canvas = await html2canvas(fieldRef.current, { useCORS: true, backgroundColor: null });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${lineupName.replace(/\s+/g, '_').toLowerCase() || 'lineup'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading image:', error);
        alert('Could not download image. See console for details.');
      }
    }
  };

  const handleSaveAndShare = () => {
    const lineupData = { lineupName, fieldType, formation, playerCount, mainJerseyColor, secondaryJerseyColor, jerseyNumberColor, players };
    localStorage.setItem('lineupData', JSON.stringify(lineupData));
    alert('Lineup saved to local storage! Share functionality can be built upon this.');
    // To share, you might generate a URL with this data encoded, or save to a backend and provide a link.
  };

  const movePlayer = (id, newLeft, newTop) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === id ? { ...p, pos: { left: newLeft, top: newTop } } : p))
    );
  };

  const handleStartEdit = (playerId) => {
    const playerToEdit = players.find(p => p.id === playerId);
    setEditingPlayer(playerToEdit);
  };

  const handleSavePlayerEdit = (playerId, newName, newNumber) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(p => 
        p.id === playerId ? { ...p, name: newName, number: newNumber } : p
      )
    );
    setEditingPlayer(null);
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 p-2 md:p-4 font-sans">
        {/* Left Sidebar Controls */}
        <div className="w-full lg:w-1/3 xl:w-1/4 bg-white p-4 md:p-6 rounded-lg shadow-xl mb-4 lg:mb-0 lg:mr-4 print-hide">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Lineup Settings</h2>
          
          <div className="mb-4">
            <label htmlFor="lineupName" className="block text-sm font-medium text-gray-700 mb-1">Name Lineup</label>
            <input 
              type="text" 
              id="lineupName" 
              value={lineupName} 
              onChange={(e) => setLineupName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700 mb-1">Field Style</label>
            <select 
              id="fieldType" 
              value={fieldType} 
              onChange={(e) => setFieldType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="striped-green">Striped Green</option>
              <option value="plain-green">Plain Green</option>
              <option value="dark-green">Dark Green</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="formation" className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
            <select 
              id="formation" 
              value={formation} 
              onChange={(e) => setFormation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="4-4-2">4-4-2</option>
              {/* Add more formations, e.g., 4-3-3, 3-5-2 */}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="playerCount" className="block text-sm font-medium text-gray-700 mb-1">Player Count</label>
            <select 
              id="playerCount" 
              value={playerCount} 
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Array.from({ length: 7 }, (_, i) => i + 5).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 border-t pt-4 mt-4">
            <h3 className="text-md font-semibold text-gray-700">Jersey Colors</h3>
            <div>
              <label htmlFor="mainColor" className="block text-xs font-medium text-gray-600">Main Color</label>
              <input type="color" id="mainColor" value={mainJerseyColor} onChange={(e) => setMainJerseyColor(e.target.value)} className="mt-1 w-full h-10 p-1 border border-gray-300 rounded-md"/>
            </div>
            {/* Secondary color picker can be added if jersey design becomes more complex */}
            <div>
              <label htmlFor="jerseyNumberColorInput" className="block text-sm font-medium text-gray-700 mb-1">Jersey Number Color</label>
              <input 
                type="color" 
                id="jerseyNumberColorInput"
                value={jerseyNumberColor} 
                onChange={(e) => setJerseyNumberColor(e.target.value)} 
                className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="playerNameColorInput" className="block text-sm font-medium text-gray-700 mb-1">Player Name Color</label>
              <input 
                type="color" 
                id="playerNameColorInput"
                value={playerNameColor} 
                onChange={(e) => setPlayerNameColor(e.target.value)} 
                className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area - Field and Players */}
        <div className="flex-1 bg-gray-200 p-2 md:p-4 rounded-lg shadow-inner flex flex-col items-center justify-center">
          <div className="w-full flex justify-between items-center mb-2 md:mb-4 print-hide">
            <h2 className="text-lg md:text-xl font-bold text-gray-700 truncate max-w-[calc(100%-220px)]">{lineupName}</h2>
            <div className="space-x-2 flex-shrink-0">
              <button 
                onClick={handleDownloadImage}
                className="px-3 py-2 md:px-4 bg-green-500 text-white text-xs md:text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 shadow-sm"
              >
                Download Image
              </button>
              <button 
                onClick={handleSaveAndShare}
                className="px-3 py-2 md:px-4 bg-blue-500 text-white text-xs md:text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-sm"
              >
                Save & Share
              </button>
            </div>
          </div>
          
          {/* Football Field Area */}
          <div className="w-full max-w-[600px] aspect-[5/7] bg-white rounded-md shadow-lg relative print-field-parent" ref={fieldRef}>
            <div 
              id="football-field"
              className={`w-full h-full relative overflow-hidden rounded-md ${currentFieldStyle.fieldClass}`}
            >
              {/* Field Markings SVG */}
              <svg width="100%" height="100%" viewBox="0 0 300 420" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                <rect width="300" height="420" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/> {/* Border */}
                <line x1="0" y1="210" x2="300" y2="210" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/> {/* Center line */}
                <circle cx="150" cy="210" r="45" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/> {/* Center circle */}
                <circle cx="150" cy="210" r="2" fill={currentFieldStyle.markingsColor} /> {/* Center spot */}
                {/* Top Penalty Area */}
                <rect x="45" y="0" width="210" height="90" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/>
                {/* Top Goal Area */}
                <rect x="90" y="0" width="120" height="30" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/>
                {/* Top Penalty Spot */}
                <circle cx="150" cy="60" r="2" fill={currentFieldStyle.markingsColor} />
                {/* Top Penalty Arc */}
                <path d="M 105 90 A 45 45 0 0 1 195 90" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/>
                {/* Bottom Penalty Area */}
                <rect x="45" y="330" width="210" height="90" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/>
                {/* Bottom Goal Area */}
                <rect x="90" y="390" width="120" height="30" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/>
                {/* Bottom Penalty Spot */}
                <circle cx="150" cy="360" r="2" fill={currentFieldStyle.markingsColor} />
                {/* Bottom Penalty Arc */}
                <path d="M 105 330 A 45 45 0 0 0 195 330" fill="none" stroke={currentFieldStyle.markingsColor} strokeWidth="2"/>
              </svg>

              {/* Render players */}
              {players.map(player => (
                <PlayerIcon 
                  key={player.id} 
                  id={player.id}
                  number={player.number} 
                  name={player.name}
                  left={player.pos.left} 
                  top={player.pos.top} 
                  jerseyColor={mainJerseyColor}
                  numberColor={jerseyNumberColor} // Pass new prop
                  nameColor={playerNameColor}     // Pass new prop
                  onMove={movePlayer}
                  onEdit={handleStartEdit}
                  fieldRect={fieldRect}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 md:mt-4 text-xs md:text-sm text-gray-600 text-center print-hide">
            Drag and drop players to change their positions. Click player icon to edit name/number.
          </p>
        </div>
      </div>
      <style jsx global>{`
        .field-stripes {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 19px,
            rgba(0,0,0,0.05) 19px,
            rgba(0,0,0,0.05) 20px
          );
          background-size: 100% 40px; /* Adjust stripe width */
        }
        @media print {
          .print-hide { display: none !important; }
          body, .min-h-screen { background-color: white !important; }
          .lg\:flex-row { flex-direction: column !important; }
          .lg\:w-1\/3, .xl\:w-1\/4, .lg\:mr-4 { width: 100% !important; margin-right: 0 !important; margin-bottom: 1rem !important; }
          .print-field-parent { width: 100% !important; max-width: 100% !important; margin: 0 auto; page-break-inside: avoid; }
          #football-field { border: 1px solid #ccc; }
        }
      `}</style>
      {editingPlayer && (
        <PlayerEditModal 
          player={editingPlayer} 
          onSave={handleSavePlayerEdit} 
          onCancel={handleCancelEdit} 
        />
      )}
    </DndProvider>
  );
};

export default LineupBuilderPage;
